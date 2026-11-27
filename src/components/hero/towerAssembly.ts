import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { splitMeshIntoIslands, type SplitIsland } from './splitMeshIslands';

export type AssemblyPhase =
  | 'LOADING'
  | 'READY_IDLE'
  | 'SCROLL_CONTROLLED'
  | 'COMPLETED';

export interface TowerSceneCallbacks {
  onProgress?: (ratio: number | null) => void;
  onPhaseChange?: (phase: AssemblyPhase) => void;
  onScrollUpdate?: (scrollProgress: number) => void;
  onReady?: () => void;
  onError?: (error: unknown) => void;
}

interface ComponentSnapshot {
  object: THREE.Object3D;
  originPos: THREE.Vector3;
  originRot: THREE.Euler;
  originScale: THREE.Vector3;
  materials: Array<{
    material: THREE.Material;
    originalTransparent: boolean;
    originalOpacity: number;
  }>;
}

const NODE_NAMES = [
  '01_Foundation',
  '02_Ladders_Railings',
  '03_Insulation',
  '04_Openings',
  '05_Platforms',
  '06_Structural_Steel',
  '07_Tower_Shell',
] as const;

type NodeName = (typeof NODE_NAMES)[number];

// Fraction of total scroll allocated to 7-stage assembly; remainder rotates the assembled tower
const ASSEMBLY_END_SCROLL = 0.66;
// 4 full rotations (1440 deg) during the post-assembly inspection phase
const POST_ASSEMBLY_ROTATIONS = 4;

/**
 * Heavy mechanical slam-in curve:
 * - 0.00 -> 0.78: Accelerates with mass (cubic ease-in) toward the seat.
 * - 0.78 -> 1.00: Brief, tightly damped 4.5% recoil off the flange before locking at 1.0.
 */
function heavySlamEase(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const impact = 0.78;
  if (t < impact) {
    const u = t / impact;
    return u * u * u;
  }
  const dt = (t - impact) / (1 - impact);
  return 1 - Math.sin(dt * Math.PI) * 0.045 * (1 - dt);
}

export class TowerAssemblyController {
  private container: HTMLElement;
  private callbacks: TowerSceneCallbacks;
  private reducedMotion: boolean;

  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private pmremGenerator: THREE.PMREMGenerator | null = null;
  private envRT: THREE.WebGLRenderTarget | null = null;
  private datumTexture: THREE.CanvasTexture | null = null;

  private towerRoot: THREE.Group;
  private components = new Map<string, ComponentSnapshot>();
  private shellBaseSnapshot: ComponentSnapshot | null = null;
  private shellNozzles: SplitIsland[] = [];
  private platformLevels: SplitIsland[] = [];
  private ladderLevels: SplitIsland[] = [];

  private masterTimeline: gsap.core.Timeline | null = null;

  private phase: AssemblyPhase = 'LOADING';
  private currentScrollProgress = 0;
  private targetScrollProgress = 0;

  // Camera & subtle mouse parallax
  private baseCamPos = new THREE.Vector3(-19, 23, 64);
  private baseCamTarget = new THREE.Vector3(-10.5, 21.5, 0);
  private mouseNorm = { x: 0, y: 0 };
  private smoothedMouse = { x: 0, y: 0 };

  // Render loop management
  private rafId: number | null = null;
  private isVisible = true;
  private isTabActive = true;
  private needsRender = true;
  private isDisposed = false;
  private lastFrameTime = 0;
  private elapsedIdleTime = 0;

  private resizeObserver: ResizeObserver | null = null;

  constructor(
    container: HTMLElement,
    callbacks: TowerSceneCallbacks = {},
    reducedMotion = false
  ) {
    this.container = container;
    this.callbacks = callbacks;
    this.reducedMotion = reducedMotion;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2('#070C14', 0.0032);

    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);
    this.camera = new THREE.PerspectiveCamera(44, width / height, 0.5, 280);
    this.updateCameraFraming(width, height);

    this.towerRoot = new THREE.Group();
    this.scene.add(this.towerRoot);
  }

  public async init(modelUrl: string): Promise<void> {
    if (this.isDisposed) return;

    try {
      this.setupRenderer();
      this.setupLighting();
      this.setupGroundPlane();
      this.bindEvents();

      const gltf = await this.loadModel(modelUrl);
      if (this.isDisposed) return;

      this.ingestModel(gltf);
      this.buildAssemblyTimeline();

      if (this.reducedMotion) {
        this.applyScrollState(ASSEMBLY_END_SCROLL);
        this.setPhase('COMPLETED');
      } else {
        this.applyScrollState(0);
        this.setPhase('READY_IDLE');
      }

      this.renderer?.compile(this.scene, this.camera);
      this.renderFrame();
      this.callbacks.onReady?.();

      this.startLoop();
    } catch (err) {
      this.callbacks.onError?.(err);
    }
  }

  private setupRenderer(): void {
    const width = Math.max(this.container.clientWidth, 1);
    const height = Math.max(this.container.clientHeight, 1);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setClearColor(0x000000, 0);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    this.container.appendChild(renderer.domElement);
    this.renderer = renderer;

    // Custom industrial studio environment (baked once, 0 FPS runtime cost)
    this.pmremGenerator = new THREE.PMREMGenerator(renderer);
    this.pmremGenerator.compileEquirectangularShader();
    const studioEnv = this.buildIndustrialStudioEnv();
    this.envRT = this.pmremGenerator.fromScene(studioEnv, 0.02);
    this.scene.environment = this.envRT.texture;
    this.disposeSceneResources(studioEnv);
  }

  private buildIndustrialStudioEnv(): THREE.Scene {
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color('#08101C');

    // Subtle overhead & horizon softbox strips for crisp cylindrical metallic highlights
    const addPanel = (
      color: string,
      intensity: number,
      w: number,
      h: number,
      pos: [number, number, number],
      lookAt: [number, number, number] = [0, 0, 0]
    ) => {
      const geo = new THREE.PlaneGeometry(w, h);
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(color).multiplyScalar(intensity),
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      mesh.lookAt(...lookAt);
      envScene.add(mesh);
    };

    // Primary warm-white vertical softbox (front-right)
    addPanel('#FFF6E8', 4.5, 6, 26, [14, 4, 12]);
    // Secondary cool steel vertical strip (back-left rim)
    addPanel('#8AB8EB', 3.4, 5, 24, [-16, 5, -10]);
    // Crisp high-key specular kicker (front-left)
    addPanel('#DCE8F7', 2.2, 4, 20, [-12, 2, 14]);
    // Restrained warm amber low-right accent strip
    addPanel('#E5A13A', 1.8, 4, 12, [14, -4, -10]);
    // Soft top sky bounce
    addPanel('#6888B0', 1.5, 20, 20, [0, 18, 0]);

    return envScene;
  }

  private disposeSceneResources(targetScene: THREE.Scene): void {
    targetScene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.geometry?.dispose();
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const m of mats) m?.dispose();
      }
    });
  }

  private setupLighting(): void {
    const hemi = new THREE.HemisphereLight('#C4D6EB', '#0B1320', 0.6);
    this.scene.add(hemi);

    // Key light with tight shadow frustum around the 43m column for crisp self-shadows
    const keyLight = new THREE.DirectionalLight('#FFF5E4', 2.45);
    keyLight.position.set(22, 46, 26);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 12;
    keyLight.shadow.camera.far = 95;
    keyLight.shadow.camera.left = -8;
    keyLight.shadow.camera.right = 8;
    keyLight.shadow.camera.top = 46;
    keyLight.shadow.camera.bottom = -2;
    keyLight.shadow.bias = -0.00035;
    keyLight.shadow.normalBias = 0.02;
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight('#7EB0E6', 1.5);
    rimLight.position.set(-30, 32, -24);
    this.scene.add(rimLight);

    const amberAccent = new THREE.DirectionalLight('#E5A13A', 0.55);
    amberAccent.position.set(20, 8, -18);
    this.scene.add(amberAccent);
  }

  private setupGroundPlane(): void {
    // Procedural 256x256 datum pad texture: soft contact AO under foundation + subtle edge ring
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const cx = 128;
      const cy = 128;
      const grad = ctx.createRadialGradient(cx, cy, 8, cx, cy, 128);
      grad.addColorStop(0.0, '#04070D'); // deep contact AO directly under foundation
      grad.addColorStop(0.14, '#080E18');
      grad.addColorStop(0.35, '#0D1623');
      grad.addColorStop(0.88, '#0A121D');
      grad.addColorStop(1.0, '#070C14');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);

      // Subtle architectural outer datum ring
      ctx.strokeStyle = 'rgba(126, 176, 230, 0.16)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 122, 0, Math.PI * 2);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    this.datumTexture = tex;

    const discGeo = new THREE.CircleGeometry(18, 64);
    const discMat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.88,
      metalness: 0.12,
      envMapIntensity: 0.35,
    });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.rotation.x = -Math.PI / 2;
    disc.position.y = -0.02;
    disc.receiveShadow = true;
    this.scene.add(disc);
  }

  private loadModel(url: string): Promise<GLTF> {
    const loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
      loader.load(
        url,
        (gltf) => resolve(gltf),
        (xhr) => {
          if (xhr.lengthComputable && xhr.total > 0) {
            this.callbacks.onProgress?.(Math.min(xhr.loaded / xhr.total, 1));
          } else {
            this.callbacks.onProgress?.(null);
          }
        },
        (err) => reject(err)
      );
    });
  }

  private registerSnapshot(key: string, obj: THREE.Object3D): ComponentSnapshot {
    const materials: ComponentSnapshot['materials'] = [];
    obj.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const matList = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];

        const maxAniso = this.renderer
          ? Math.min(this.renderer.capabilities.getMaxAnisotropy(), 8)
          : 4;

        for (const mat of matList) {
          if (mat && (mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
            const std = mat as THREE.MeshStandardMaterial;
            for (const tex of [std.map, std.roughnessMap, std.metalnessMap, std.normalMap]) {
              if (tex) {
                tex.anisotropy = maxAniso;
              }
            }

            const mName = std.name;
            if (mName.includes('Insulation cladding')) {
              std.envMapIntensity = 1.15;
              std.metalness = 0.88;
              std.roughness = 0.3;
            } else if (mName.includes('Platform grating')) {
              std.envMapIntensity = 0.95;
              std.roughness = 0.42;
            } else if (mName.includes('Structural steel')) {
              std.envMapIntensity = 0.85;
              std.metalness = 0.55;
              std.roughness = 0.45;
            } else if (mName.includes('Vessel shells')) {
              std.envMapIntensity = 0.78;
              std.roughness = 0.38;
            } else if (mName.includes('Handrails')) {
              std.envMapIntensity = 0.65;
              std.roughness = 0.42;
            } else if (mName.includes('Concrete')) {
              std.envMapIntensity = 0.28;
              std.roughness = 0.88;
            } else {
              std.envMapIntensity = 0.65;
            }
          }
          materials.push({
            material: mat,
            originalTransparent: mat.transparent,
            originalOpacity: mat.opacity,
          });
        }
      }
    });

    const snap: ComponentSnapshot = {
      object: obj,
      originPos: obj.position.clone(),
      originRot: obj.rotation.clone(),
      originScale: obj.scale.clone(),
      materials,
    };
    this.components.set(key, snap);
    return snap;
  }

  private replaceWithSplitIslands(
    root: THREE.Object3D,
    nodeName: NodeName,
    prefix: string,
    elevationBands?: Array<{ minY: number; maxY: number }>
  ): SplitIsland[] {
    const obj = root.getObjectByName(nodeName);
    if (!obj || !(obj as THREE.Mesh).isMesh) return [];

    const sourceMesh = obj as THREE.Mesh;
    const parent = sourceMesh.parent ?? root;
    const islands = splitMeshIntoIslands(sourceMesh, prefix, elevationBands);

    if (islands.length === 0) {
      this.registerSnapshot(nodeName, sourceMesh);
      return [];
    }

    for (const isl of islands) {
      parent.add(isl.mesh);
      this.registerSnapshot(isl.mesh.name, isl.mesh);
    }

    // Remove and dispose original unsplit mesh
    parent.remove(sourceMesh);
    sourceMesh.geometry?.dispose();
    const mats = Array.isArray(sourceMesh.material)
      ? sourceMesh.material
      : [sourceMesh.material];
    for (const m of mats) m?.dispose();

    return islands;
  }

  private ingestModel(gltf: GLTF): void {
    const root = gltf.scene;

    for (const name of NODE_NAMES) {
      if (name === '07_Tower_Shell') {
        const shellParts = this.replaceWithSplitIslands(root, name, '07_ShellPart');
        if (shellParts.length > 0) {
          // Island 1 (lowest & largest, y=0..3.45) is the base skirt; remaining 7 are nozzles
          this.shellBaseSnapshot =
            this.components.get(shellParts[0].mesh.name) ?? null;
          this.shellNozzles = shellParts.slice(1);
        }
        continue;
      }

      if (name === '05_Platforms') {
        this.platformLevels = this.replaceWithSplitIslands(root, name, '05_Platform');
        continue;
      }

      if (name === '02_Ladders_Railings') {
        // Cluster 205 rungs/cages/handrails into 6 elevation bands matching the 6 platforms
        const ladderBands = [
          { minY: -1, maxY: 9.0 },
          { minY: 9.0, maxY: 15.5 },
          { minY: 15.5, maxY: 22.0 },
          { minY: 22.0, maxY: 28.5 },
          { minY: 28.5, maxY: 35.5 },
          { minY: 35.5, maxY: 60.0 },
        ];
        this.ladderLevels = this.replaceWithSplitIslands(
          root,
          name,
          '02_LadderLevel',
          ladderBands
        );
        continue;
      }

      const obj = root.getObjectByName(name);
      if (obj) {
        this.registerSnapshot(name, obj);
      }
    }

    this.towerRoot.add(root);
  }

  private setComponentOpacity(snap: ComponentSnapshot, alpha: number): void {
    for (const entry of snap.materials) {
      const clamped = THREE.MathUtils.clamp(alpha, 0, 1);
      if (clamped >= 0.999) {
        entry.material.transparent = entry.originalTransparent;
        entry.material.opacity = entry.originalOpacity;
      } else {
        entry.material.transparent = true;
        entry.material.opacity = entry.originalOpacity * clamped;
      }
      entry.material.needsUpdate = false;
    }
  }

  private buildAssemblyTimeline(): void {
    const tl = gsap.timeline({ paused: true });

    const animatePart = (
      key: string,
      startTime: number,
      duration: number,
      offset: {
        x?: number;
        y?: number;
        z?: number;
        rx?: number;
        ry?: number;
        rz?: number;
        scale?: number;
        minAlpha?: number;
      },
      ease: string | ((t: number) => number) = heavySlamEase
    ) => {
      const snap = this.components.get(key);
      if (!snap) return;

      const { object, originPos, originRot, originScale } = snap;
      const proxy = { t: 0 };
      const startScale = offset.scale ?? 1;
      const minAlpha = offset.minAlpha ?? 0;

      tl.fromTo(
        proxy,
        { t: 0 },
        {
          t: 1,
          duration,
          ease,
          onUpdate: () => {
            const p = proxy.t;
            const inv = 1 - p;

            object.position.set(
              originPos.x + (offset.x ?? 0) * inv,
              originPos.y + (offset.y ?? 0) * inv,
              originPos.z + (offset.z ?? 0) * inv
            );

            object.rotation.set(
              originRot.x + (offset.rx ?? 0) * inv,
              originRot.y + (offset.ry ?? 0) * inv,
              originRot.z + (offset.rz ?? 0) * inv
            );

            const s = THREE.MathUtils.lerp(startScale, 1, p);
            object.scale.set(
              originScale.x * s,
              originScale.y * s,
              originScale.z * s
            );

            const alpha = THREE.MathUtils.lerp(
              minAlpha,
              1,
              THREE.MathUtils.clamp(p / 0.35, 0, 1)
            );
            this.setComponentOpacity(snap, alpha);
            object.visible = alpha > 0.01;
          },
        },
        startTime
      );
    };

    // 1. Foundation rises from below to establish the datum
    animatePart('01_Foundation', 0.0, 0.1, { y: -3.8, scale: 0.96 }, heavySlamEase);

    // 2. Shell Base Skirt starts grounded in its exact position (no floating/hover)
    if (this.shellBaseSnapshot) {
      animatePart(
        this.shellBaseSnapshot.object.name,
        0.0,
        0.01,
        { minAlpha: 1 },
        'none'
      );
    }

    // 3. 7 Shell Nozzles start just slightly pulled out & slam into their ports one by one
    this.shellNozzles.forEach((nozzle, i) => {
      const isCrown = i === this.shellNozzles.length - 1;
      const dirLen = Math.hypot(nozzle.centerX, nozzle.centerZ) || 1;
      const pullOut = 0.95;
      const offsetX = isCrown ? 0 : (nozzle.centerX / dirLen) * pullOut;
      const offsetZ = isCrown ? 0 : (nozzle.centerZ / dirLen) * pullOut;
      const offsetY = isCrown ? 0.9 : 0;

      animatePart(
        nozzle.mesh.name,
        0.11 + i * 0.03,
        0.07,
        {
          x: offsetX,
          y: offsetY,
          z: offsetZ,
          minAlpha: 1,
        },
        heavySlamEase
      );
    });

    // 4. Aluminium Insulation Cladding drops & seats over the column core
    animatePart('03_Insulation', 0.35, 0.11, { y: 6.5, scale: 1.03 }, heavySlamEase);

    // 5. 6 Platforms slide in from their respective sides and lock into place
    this.platformLevels.forEach((plat, i) => {
      const isCrownRing = i === this.platformLevels.length - 1;
      const sideX = isCrownRing ? 0 : plat.centerX >= 0 ? 5.5 : -5.5;
      const dropY = isCrownRing ? 4.2 : 0.8;
      animatePart(
        plat.mesh.name,
        0.45 + i * 0.035,
        0.08,
        { x: sideX, y: dropY, scale: 0.98 },
        heavySlamEase
      );
    });

    // 6. Structural Steel jib slams onto the crown
    animatePart('06_Structural_Steel', 0.67, 0.085, { x: 4.5, y: 4.0 }, heavySlamEase);

    // 7. 6 Ladder & Railing Levels lock in one by one bottom-to-top
    this.ladderLevels.forEach((lvl, i) => {
      const sideX = Math.abs(lvl.centerX) > 0.3 ? Math.sign(lvl.centerX) * 3.2 : 0;
      animatePart(
        lvl.mesh.name,
        0.74 + i * 0.028,
        0.075,
        { x: sideX, z: 4.0, y: 1.0 },
        heavySlamEase
      );
    });

    // 8. Final Openings / Manway slams into base port
    animatePart('04_Openings', 0.91, 0.09, { z: 3.5, y: 0.3 }, heavySlamEase);

    tl.totalDuration(1.0);
    this.masterTimeline = tl;
  }

  private applyIdleHover(t: number, blend: number): void {
    if (blend <= 0.001) return;

    // Lower base stays grounded; each nozzle breathes gently along its own port axis
    this.shellNozzles.forEach((nozzle, i) => {
      const isCrown = i === this.shellNozzles.length - 1;
      const phase = i * 0.9;
      const delta = Math.sin(t * 0.85 + phase) * 0.08 * blend;

      if (isCrown) {
        nozzle.mesh.position.y += delta;
      } else {
        const dirLen = Math.hypot(nozzle.centerX, nozzle.centerZ) || 1;
        nozzle.mesh.position.x += (nozzle.centerX / dirLen) * delta;
        nozzle.mesh.position.z += (nozzle.centerZ / dirLen) * delta;
      }
    });
  }

  private applyScrollState(sp: number): void {
    const assemblyP = THREE.MathUtils.clamp(sp / ASSEMBLY_END_SCROLL, 0, 1);
    const rotationP = THREE.MathUtils.clamp(
      (sp - ASSEMBLY_END_SCROLL) / (1 - ASSEMBLY_END_SCROLL),
      0,
      1
    );

    this.masterTimeline?.progress(assemblyP);

    // Zero-G hover fades out smoothly as scroll pulls the exploded shell together
    const hoverBlend = this.reducedMotion
      ? 0
      : 1 - THREE.MathUtils.clamp(sp / 0.14, 0, 1);
    this.applyIdleHover(this.elapsedIdleTime, hoverBlend);

    // Post-assembly 1.5 full rotations
    this.towerRoot.rotation.y = rotationP * Math.PI * 2 * POST_ASSEMBLY_ROTATIONS;

    this.applyCameraForProgress(assemblyP);
  }

  private applyCameraForProgress(assemblyP: number): void {
    const orbitAngle = THREE.MathUtils.lerp(-0.16, 0, this.easeOutCubic(assemblyP));
    const cos = Math.cos(orbitAngle);
    const sin = Math.sin(orbitAngle);

    const bx = this.baseCamPos.x - this.baseCamTarget.x;
    const bz = this.baseCamPos.z - this.baseCamTarget.z;

    const orbitedX = this.baseCamTarget.x + (bx * cos - bz * sin);
    const orbitedZ = this.baseCamTarget.z + (bx * sin + bz * cos);

    const elevOffset = THREE.MathUtils.lerp(-2.5, 0, this.easeOutCubic(assemblyP));

    const parallaxX = this.smoothedMouse.x * 1.4;
    const parallaxY = this.smoothedMouse.y * 0.8;

    this.camera.position.set(
      orbitedX + parallaxX,
      this.baseCamPos.y + elevOffset + parallaxY,
      orbitedZ
    );
    this.camera.lookAt(
      this.baseCamTarget.x + parallaxX * 0.15,
      this.baseCamTarget.y,
      this.baseCamTarget.z
    );
  }

  private easeOutCubic(x: number): number {
    return 1 - Math.pow(1 - x, 3);
  }

  public handleScrollProgress(scrollProgress: number): void {
    if (this.reducedMotion || this.isDisposed) return;

    const sp = THREE.MathUtils.clamp(scrollProgress, 0, 1);
    this.targetScrollProgress = sp;
    this.needsRender = true;

    if (sp <= 0.01) {
      this.setPhase('READY_IDLE');
    } else if (sp >= 0.995) {
      this.setPhase('COMPLETED');
    } else {
      this.setPhase('SCROLL_CONTROLLED');
    }

    this.callbacks.onScrollUpdate?.(sp);
  }

  private setPhase(next: AssemblyPhase): void {
    if (this.phase === next) return;
    this.phase = next;
    this.callbacks.onPhaseChange?.(next);
  }

  private updateCameraFraming(width: number, height: number): void {
    const aspect = width / Math.max(height, 1);
    this.camera.aspect = aspect;

    // Portrait / narrow viewports (mobile & portrait iPad):
    // Frame the full tower in the upper half so copy sits cleanly below without overlapping.
    if (width < 768 || (width < 1024 && aspect < 1.05)) {
      const fov = 46;
      const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(fov * 0.5));
      // Ensure both tower height (~46u) and datum pad width (36u) fit with comfortable margins
      const distForHeight = 46 / (2 * tanHalfFov * 0.52);
      const distForWidth = 38 / (2 * tanHalfFov * aspect * 0.88);
      const dist = Math.max(distForHeight, distForWidth, 74);

      // Shifting target.y DOWN moves the tower UP into the upper half of the viewport
      const targetY = width < 768 ? 10.5 : 13.5;
      this.baseCamPos.set(-14, targetY + 2, dist);
      this.baseCamTarget.set(0, targetY, 0);
      this.camera.fov = fov;
    } else if (width < 1180) {
      // Landscape tablet / small laptop: side-by-side with full vertical breathing room
      const fov = 44;
      const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(fov * 0.5));
      const dist = Math.max(70, 52 / (2 * tanHalfFov * 0.88));
      const halfW = dist * tanHalfFov * aspect;
      const marginPx = Math.min(48, Math.max(24, width * 0.04));
      const marginFrac = marginPx / width;
      const offset = THREE.MathUtils.clamp(
        (1 - 2 * marginFrac) * halfW - 18,
        10,
        18
      );
      this.baseCamPos.set(-offset - 8.5, 23, dist);
      this.baseCamTarget.set(-offset, 21.5, 0);
      this.camera.fov = fov;
    } else {
      // Desktop: match right margin of 18m datum pad to left margin of 1380px container
      const fov = 43;
      const dist = 66;
      const halfW = dist * Math.tan(THREE.MathUtils.degToRad(fov * 0.5)) * aspect;
      const padPx = Math.min(48, Math.max(20, width * 0.04));
      const leftMarginPx = Math.max(0, (width - 1380) * 0.5) + padPx;
      const marginFrac = leftMarginPx / width;
      const offset = THREE.MathUtils.clamp(
        (1 - 2 * marginFrac) * halfW - 18,
        14,
        21
      );
      this.baseCamPos.set(-offset - 8.5, 23, dist);
      this.baseCamTarget.set(-offset, 21.5, 0);
      this.camera.fov = fov;
    }

    this.camera.updateProjectionMatrix();
    this.needsRender = true;
  }

  private bindEvents(): void {
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0 && this.renderer) {
          this.renderer.setSize(width, height);
          this.updateCameraFraming(width, height);
        }
      }
    });
    this.resizeObserver.observe(this.container);

    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  private onPointerMove = (e: PointerEvent): void => {
    if (this.reducedMotion) return;
    const nx = (e.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
    const ny = -((e.clientY / Math.max(window.innerHeight, 1)) * 2 - 1);
    this.mouseNorm.x = THREE.MathUtils.clamp(nx, -1, 1);
    this.mouseNorm.y = THREE.MathUtils.clamp(ny, -1, 1);
    this.needsRender = true;
  };

  private onVisibilityChange = (): void => {
    this.isTabActive = document.visibilityState === 'visible';
    if (this.isTabActive) {
      this.lastFrameTime = performance.now();
      this.needsRender = true;
    }
  };

  public setViewportVisibility(visible: boolean): void {
    this.isVisible = visible;
    if (visible) {
      this.lastFrameTime = performance.now();
      this.needsRender = true;
    }
  }

  private startLoop(): void {
    this.lastFrameTime = performance.now();
    const tick = (now: number) => {
      if (this.isDisposed) return;
      this.rafId = requestAnimationFrame(tick);

      if (!this.isTabActive || !this.isVisible) return;

      const dt = Math.min((now - this.lastFrameTime) / 1000, 0.1);
      this.lastFrameTime = now;

      let active = this.needsRender;

      // Idle zero-G hovering runs continuously while exploded shell is visible
      if (!this.reducedMotion && this.currentScrollProgress < 0.14) {
        this.elapsedIdleTime += dt;
        active = true;
      }

      // Smoothly damp scroll-driven progress for weighty mechanical feel
      const diff = this.targetScrollProgress - this.currentScrollProgress;
      if (Math.abs(diff) > 0.00025) {
        const factor = 1 - Math.exp(-8.5 * dt);
        this.currentScrollProgress += diff * factor;
        active = true;
      } else if (diff !== 0) {
        this.currentScrollProgress = this.targetScrollProgress;
        active = true;
      }

      // Smoothly damp mouse parallax
      if (!this.reducedMotion) {
        const dx = this.mouseNorm.x - this.smoothedMouse.x;
        const dy = this.mouseNorm.y - this.smoothedMouse.y;
        if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
          const mFactor = 1 - Math.exp(-5 * dt);
          this.smoothedMouse.x += dx * mFactor;
          this.smoothedMouse.y += dy * mFactor;
          active = true;
        }
      }

      if (active) {
        this.applyScrollState(this.currentScrollProgress);
        this.renderFrame();
        this.needsRender = false;
      }
    };

    this.rafId = requestAnimationFrame(tick);
  }

  private renderFrame(): void {
    if (!this.renderer) return;
    this.renderer.render(this.scene, this.camera);
  }

  public dispose(): void {
    this.isDisposed = true;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    this.masterTimeline?.kill();
    this.resizeObserver?.disconnect();

    window.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);

    this.scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.geometry?.dispose();
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const m of mats) {
          m?.dispose();
        }
      }
    });

    this.datumTexture?.dispose();
    this.envRT?.dispose();
    this.pmremGenerator?.dispose();

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.domElement.remove();
      this.renderer = null;
    }
  }
}
