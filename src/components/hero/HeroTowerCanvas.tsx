import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  TowerAssemblyController,
  type AssemblyPhase,
} from './towerAssembly';
import { COMPANY } from '../../data/companyData';
import './HeroTower.css';

gsap.registerPlugin(ScrollTrigger);

const MODEL_URL = '/models/distillation_tower.glb';

function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    );
  } catch {
    return false;
  }
}

export function HeroTowerCanvas() {
  const stageRef = useRef<HTMLElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<TowerAssemblyController | null>(null);

  const [webglSupported] = useState<boolean>(() => checkWebGLSupport());
  const [reducedMotion, setReducedMotion] = useState<boolean>(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );
  const [loadRatio, setLoadRatio] = useState<number | null>(0);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [phase, setPhase] = useState<AssemblyPhase>('LOADING');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const host = canvasHostRef.current;
    const stage = stageRef.current;
    if (!host || !stage || !webglSupported) return;

    const controller = new TowerAssemblyController(
      host,
      {
        onProgress: (ratio) => setLoadRatio(ratio),
        onPhaseChange: (nextPhase) => setPhase(nextPhase),
        onScrollUpdate: (sp) => setScrollProgress(sp),
        onReady: () => {
          setIsReady(true);
        },
        onError: (err) => {
          console.error('3D Distillation Tower failed to load:', err);
          setHasError(true);
        },
      },
      reducedMotion
    );

    controllerRef.current = controller;
    controller.init(MODEL_URL);

    const io = new IntersectionObserver(
      ([entry]) => {
        controller.setViewportVisibility(entry.isIntersecting);
      },
      { threshold: 0.01 }
    );
    io.observe(stage);

    const st = ScrollTrigger.create({
      trigger: stage,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        controller.handleScrollProgress(self.progress);
      },
    });

    return () => {
      st.kill();
      io.disconnect();
      controller.dispose();
      controllerRef.current = null;
    };
  }, [webglSupported, reducedMotion]);

  const useStaticFallback = !webglSupported || hasError;
  const stageClassName = [
    'hero-stage',
    reducedMotion || useStaticFallback ? 'hero-stage--static' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const showScrollHint =
    !useStaticFallback && !reducedMotion && isReady && scrollProgress < 0.06;

  return (
    <section
      ref={stageRef}
      className={stageClassName}
      aria-label="Introduction — Industrial Distillation Column"
    >
      <div className="hero">
        {/* Subtle Engineering Blueprint Grid Backdrop */}
        <div className="hero__blueprint" aria-hidden="true" />

        {/* Static poster / fallback layer */}
        <div
          className={`hero__poster ${
            isReady && !useStaticFallback ? 'hero__poster--hidden' : ''
          }`}
          aria-hidden={isReady && !useStaticFallback}
        >
          <img
            src="/images/hero-plant-main.jpg"
            alt="Industrial petrochemical processing facility with stainless steel distillation column"
            className="hero__poster-img"
            loading="eager"
            fetchPriority="high"
          />
          <div className="hero__poster-scrim" />
        </div>

        {/* Single WebGL Canvas Host */}
        {!useStaticFallback && (
          <div
            ref={canvasHostRef}
            className={`hero__canvas-host ${
              isReady ? 'hero__canvas-host--ready' : ''
            }`}
            aria-hidden="true"
          />
        )}

        {/* Left-side readability gradient over dark navy */}
        <div className="hero__readability-scrim" aria-hidden="true" />

        {/* Minimal engineering loading bar (only while loading) */}
        {!useStaticFallback && !isReady && (
          <div
            className="hero__loader"
            role="status"
            aria-live="polite"
            aria-label="Loading 3D distillation column"
          >
            <span className="hero__loader-brand">{COMPANY.shortName}</span>
            <div className="hero__loader-track">
              <div
                className={`hero__loader-fill ${
                  loadRatio === null ? 'hero__loader-fill--indeterminate' : ''
                }`}
                style={
                  loadRatio !== null
                    ? { transform: `scaleX(${Math.max(0.04, loadRatio)})` }
                    : undefined
                }
              />
            </div>
            {loadRatio !== null && (
              <span className="hero__loader-pct">
                {Math.round(loadRatio * 100)}%
              </span>
            )}
          </div>
        )}

        {/* Hero Copy & CTAs */}
        <div className="container hero__container">
          <div
            className={`hero__content ${
              phase === 'COMPLETED' || isReady || useStaticFallback
                ? 'hero__content--visible'
                : ''
            }`}
          >
            <span className="hero__eyebrow">
              Industrial Procurement &amp; Engineering Supplies
            </span>
            <h1 className="hero__title">
              The right supply.
              <br />
              The right solution.
            </h1>
            <p className="hero__subtitle">
              Reliable industrial equipment, process plant spares and engineering
              supplies for modern industries.
            </p>
            <div className="hero__actions">
              <Link to="/products" className="btn btn--primary">
                Explore Products
                <ArrowRight size={16} />
              </Link>
              <Link to="/contact" className="btn btn--outline-light">
                Request a Quote
              </Link>
            </div>
            <p className="hero__location">Pune, Maharashtra, India</p>
          </div>
        </div>

        {/* Subtle Scroll-to-Assemble Cue */}
        {!useStaticFallback && !reducedMotion && (
          <div
            className={`hero__scroll-hint ${
              showScrollHint ? 'hero__scroll-hint--visible' : ''
            }`}
            aria-hidden="true"
          >
            <span className="hero__scroll-line" />
            <span className="hero__scroll-label">Scroll to assemble</span>
          </div>
        )}
      </div>
    </section>
  );
}
