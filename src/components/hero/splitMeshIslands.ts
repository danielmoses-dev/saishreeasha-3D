import * as THREE from 'three';

export interface SplitIsland {
  mesh: THREE.Mesh;
  minY: number;
  maxY: number;
  centerX: number;
  centerZ: number;
  triangleCount: number;
}

/**
 * Splits a single THREE.Mesh into disconnected geometry islands using spatial
 * vertex union-find. Optionally clusters islands into elevation bands (by
 * centerY) to avoid creating hundreds of draw calls for small fasteners/rungs.
 *
 * All vertex coordinates remain in the original mesh's coordinate space so
 * zeroing position/rotation/scale reproduces the exact original model.
 */
export function splitMeshIntoIslands(
  sourceMesh: THREE.Mesh,
  namePrefix: string,
  elevationBands?: Array<{ minY: number; maxY: number }>
): SplitIsland[] {
  const geo = sourceMesh.geometry;
  const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;
  const indexAttr = geo.getIndex();

  if (!posAttr || !indexAttr) {
    return [];
  }

  const posArray = posAttr.array as Float32Array;
  const idxArray = indexAttr.array;
  const vertCount = posAttr.count;
  const triCount = indexAttr.count / 3;

  // 1. Deduplicate spatial positions (merges UV/normal seams on the same solid)
  const vKey = new Int32Array(vertCount);
  const keyMap = new Map<string, number>();
  let uniqueVerts = 0;

  for (let i = 0; i < vertCount; i++) {
    const x = Math.round(posArray[i * 3] * 500);
    const y = Math.round(posArray[i * 3 + 1] * 500);
    const z = Math.round(posArray[i * 3 + 2] * 500);
    const k = `${x},${y},${z}`;
    let id = keyMap.get(k);
    if (id === undefined) {
      id = uniqueVerts++;
      keyMap.set(k, id);
    }
    vKey[i] = id;
  }

  // 2. Union-Find over triangles
  const parent = new Int32Array(uniqueVerts);
  for (let i = 0; i < uniqueVerts; i++) parent[i] = i;

  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };

  const unite = (a: number, b: number) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[rb] = ra;
  };

  for (let t = 0; t < triCount; t++) {
    const i0 = vKey[idxArray[t * 3]];
    const i1 = vKey[idxArray[t * 3 + 1]];
    const i2 = vKey[idxArray[t * 3 + 2]];
    unite(i0, i1);
    unite(i0, i2);
  }

  // 3. Group triangle indices by root island
  const islandTris = new Map<
    number,
    { tris: number[]; minY: number; maxY: number; minX: number; maxX: number; minZ: number; maxZ: number }
  >();

  for (let t = 0; t < triCount; t++) {
    const a = idxArray[t * 3];
    const b = idxArray[t * 3 + 1];
    const c = idxArray[t * 3 + 2];
    const root = find(vKey[a]);

    let entry = islandTris.get(root);
    if (!entry) {
      entry = {
        tris: [],
        minY: Infinity,
        maxY: -Infinity,
        minX: Infinity,
        maxX: -Infinity,
        minZ: Infinity,
        maxZ: -Infinity,
      };
      islandTris.set(root, entry);
    }

    entry.tris.push(a, b, c);
    for (const vi of [a, b, c]) {
      const vx = posArray[vi * 3];
      const vy = posArray[vi * 3 + 1];
      const vz = posArray[vi * 3 + 2];
      if (vx < entry.minX) entry.minX = vx;
      if (vx > entry.maxX) entry.maxX = vx;
      if (vy < entry.minY) entry.minY = vy;
      if (vy > entry.maxY) entry.maxY = vy;
      if (vz < entry.minZ) entry.minZ = vz;
      if (vz > entry.maxZ) entry.maxZ = vz;
    }
  }

  // 4. Optionally cluster islands into elevation bands
  const buckets: Array<{
    tris: number[];
    minY: number;
    maxY: number;
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  }> = [];

  if (elevationBands && elevationBands.length > 0) {
    for (let i = 0; i < elevationBands.length; i++) {
      buckets.push({
        tris: [],
        minY: Infinity,
        maxY: -Infinity,
        minX: Infinity,
        maxX: -Infinity,
        minZ: Infinity,
        maxZ: -Infinity,
      });
    }

    for (const isl of islandTris.values()) {
      const midY = (isl.minY + isl.maxY) * 0.5;
      let bandIdx = elevationBands.findIndex(
        (b) => midY >= b.minY && midY < b.maxY
      );
      if (bandIdx === -1) bandIdx = elevationBands.length - 1;

      const bucket = buckets[bandIdx];
      for (let i = 0; i < isl.tris.length; i++) {
        bucket.tris.push(isl.tris[i]);
      }
      if (isl.minX < bucket.minX) bucket.minX = isl.minX;
      if (isl.maxX > bucket.maxX) bucket.maxX = isl.maxX;
      if (isl.minY < bucket.minY) bucket.minY = isl.minY;
      if (isl.maxY > bucket.maxY) bucket.maxY = isl.maxY;
      if (isl.minZ < bucket.minZ) bucket.minZ = isl.minZ;
      if (isl.maxZ > bucket.maxZ) bucket.maxZ = isl.maxZ;
    }
  } else {
    for (const isl of islandTris.values()) {
      buckets.push(isl);
    }
    buckets.sort((a, b) => a.minY - b.minY);
  }

  // 5. Build compacted BufferGeometries for each bucket
  const attributes = Object.keys(geo.attributes);
  const result: SplitIsland[] = [];

  buckets.forEach((bucket, idx) => {
    if (bucket.tris.length === 0) return;

    const remap = new Map<number, number>();
    const usedVerts: number[] = [];
    const newIndices = new Uint32Array(bucket.tris.length);

    for (let i = 0; i < bucket.tris.length; i++) {
      const oldVi = bucket.tris[i];
      let newVi = remap.get(oldVi);
      if (newVi === undefined) {
        newVi = usedVerts.length;
        remap.set(oldVi, newVi);
        usedVerts.push(oldVi);
      }
      newIndices[i] = newVi;
    }

    const newGeo = new THREE.BufferGeometry();
    for (const attrName of attributes) {
      const srcAttr = geo.getAttribute(attrName) as THREE.BufferAttribute;
      const itemSize = srcAttr.itemSize;
      const srcArr = srcAttr.array as Float32Array;
      const dstArr = new Float32Array(usedVerts.length * itemSize);

      for (let i = 0; i < usedVerts.length; i++) {
        const srcBase = usedVerts[i] * itemSize;
        const dstBase = i * itemSize;
        for (let k = 0; k < itemSize; k++) {
          dstArr[dstBase + k] = srcArr[srcBase + k];
        }
      }
      newGeo.setAttribute(attrName, new THREE.BufferAttribute(dstArr, itemSize));
    }

    newGeo.setIndex(new THREE.BufferAttribute(newIndices, 1));
    newGeo.computeBoundingBox();
    newGeo.computeBoundingSphere();

    // Clone material per sub-mesh so independent opacity fades never conflict
    const mat = Array.isArray(sourceMesh.material)
      ? sourceMesh.material.map((m) => m.clone())
      : sourceMesh.material.clone();

    const subMesh = new THREE.Mesh(newGeo, mat);
    subMesh.name = `${namePrefix}_${idx + 1}`;
    subMesh.castShadow = sourceMesh.castShadow;
    subMesh.receiveShadow = sourceMesh.receiveShadow;
    subMesh.position.copy(sourceMesh.position);
    subMesh.rotation.copy(sourceMesh.rotation);
    subMesh.scale.copy(sourceMesh.scale);

    result.push({
      mesh: subMesh,
      minY: bucket.minY,
      maxY: bucket.maxY,
      centerX: (bucket.minX + bucket.maxX) * 0.5,
      centerZ: (bucket.minZ + bucket.maxZ) * 0.5,
      triangleCount: bucket.tris.length / 3,
    });
  });

  return result;
}
