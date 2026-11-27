import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Layers,
  Crosshair,
  ShieldCheck,
  Briefcase,
  Headphones,
  Truck,
} from 'lucide-react';
import { Layout } from '../components/Layout';
import { Reveal } from '../components/Reveal';
import { CTASection } from '../components/CTASection';
import { HeroTowerCanvas } from '../components/hero/HeroTowerCanvas';
import {
  COMPANY,
  FEATURED_EQUIPMENT,
  INDUSTRIES,
  PROCUREMENT_STEPS,
  WHY_CHOOSE_US,
} from '../data/companyData';
import './HomePage.css';

const WHY_ICONS = {
  range: Layers,
  sourcing: Crosshair,
  quality: ShieldCheck,
  commercial: Briefcase,
  support: Headphones,
  supply: Truck,
};

export function HomePage() {
  const [introParallax, setIntroParallax] = useState(0);
  const [timelineActive, setTimelineActive] = useState(false);

  const introRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Restrained scroll parallax for intro image via passive listener + rAF
  useEffect(() => {
    let rafId = 0;
    const updateParallax = () => {
      if (introRef.current) {
        const rect = introRef.current.getBoundingClientRect();
        const vh = window.innerHeight;
        if (rect.top < vh && rect.bottom > 0) {
          const progress = (vh - rect.top) / (vh + rect.height) - 0.5;
          setIntroParallax(progress * 26);
        }
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Procurement timeline viewport trigger
  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimelineActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const featuredIndustries = [
    INDUSTRIES[0], // Oil & Gas
    INDUSTRIES[1], // Chemical & Process
    INDUSTRIES[8], // Power Plants & Energy
  ];

  const homepageWhy = WHY_CHOOSE_US.slice(0, 6);

  return (
    <Layout hasHero>
      {/* SECTION 01 — INTERACTIVE 3D DISTILLATION COLUMN HERO */}
      <HeroTowerCanvas />

      {/* SECTION 02 — COMPANY INTRODUCTION */}
      <section ref={introRef} className="section section--white" aria-labelledby="intro-heading">
        <div className="container">
          <div className="intro-grid">
            <Reveal variant="image">
              <div className="intro-media">
                <div
                  className="intro-media__img-wrap"
                  style={{ transform: `translate3d(0, ${introParallax}px, 0)` }}
                >
                  <img
                    src="/images/hero-plant.jpg"
                    alt="Engineers reviewing technical process piping specifications inside an industrial plant"
                    loading="lazy"
                  />
                </div>
                <span className="intro-media__tag">Single-Window Sourcing Partner</span>
              </div>
            </Reveal>

            <div>
              <Reveal>
                <span className="eyebrow">Who We Are</span>
                <h2 id="intro-heading" className="heading-lg intro-copy__heading">
                  Engineering Industry. Simplifying Procurement.
                </h2>
              </Reveal>
              <Reveal delay={90}>
                <div className="intro-copy__body">
                  <p className="body-lg">
                    SAISHREEASHA GLOBAL VENTURES PRIVATE LIMITED is an industrial trading,
                    procurement and supply company providing industrial equipment, engineering
                    materials, plant spares, accessories and consumables.
                  </p>
                  <p className="body-md">
                    We support industrial plants, engineering companies, fabrication units,
                    infrastructure projects and maintenance organisations through
                    application-oriented sourcing and dependable supply coordination.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={180}>
                <Link to="/about" className="btn btn--dark">
                  Discover Our Company
                  <ArrowRight size={16} />
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03 — PRODUCTS & SOLUTIONS (6 CORE EQUIPMENT LINES) */}
      <section className="section section--alt" aria-labelledby="products-heading">
        <div className="container">
          <Reveal>
            <div className="section-header">
              <div className="section-header__copy">
                <span className="eyebrow">Products &amp; Solutions</span>
                <h2 id="products-heading" className="heading-lg">
                  Core Industrial Equipment
                </h2>
              </div>
              <Link to="/products" className="btn btn--outline-dark">
                View Full Specifications
                <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>

          <div className="featured-equipment-grid">
            {FEATURED_EQUIPMENT.map((item, idx) => (
              <Reveal key={item.code} delay={idx * 55}>
                <Link to={item.to} className="equipment-card">
                  <div className="equipment-card__stage">
                    <span className="equipment-card__code">{item.code}</span>
                    {item.brand && (
                      <span className="equipment-card__brand">{item.brand}</span>
                    )}
                    <img
                      src={item.image}
                      alt={item.imageAlt}
                      className="equipment-card__img"
                      loading="lazy"
                    />
                  </div>
                  <div className="equipment-card__body">
                    <h3 className="equipment-card__title">{item.name}</h3>
                    <p className="equipment-card__desc">{item.summary}</p>
                    <span className="equipment-card__cta">
                      {item.ctaLabel}
                      <ArrowRight size={15} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 04 — INDUSTRIES WE SERVE */}
      <section className="section section--white" aria-labelledby="industries-heading">
        <div className="container">
          <Reveal>
            <div className="section-header">
              <div className="section-header__copy">
                <span className="eyebrow">Industries We Serve</span>
                <h2 id="industries-heading" className="heading-lg">
                  Supporting Critical Industrial Sectors
                </h2>
              </div>
              <Link to="/industries" className="btn btn--outline-dark">
                Explore Industries
                <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>

          <Reveal variant="image">
            <div className="industries-showcase">
              {featuredIndustries.map((ind) => (
                <Link key={ind.slug} to="/industries" className="industry-photo-card">
                  <img src={ind.image} alt={ind.name} loading="lazy" />
                  <div className="industry-photo-card__overlay">
                    <span className="industry-photo-card__label">{ind.name}</span>
                    <ArrowRight size={18} className="industry-photo-card__arrow" />
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="industries-list">
              {INDUSTRIES.map((ind) => (
                <Link key={ind.slug} to="/industries" className="industry-row">
                  <span className="industry-row__left">
                    <span className="industry-row__dot" aria-hidden="true" />
                    <span className="industry-row__name">{ind.name}</span>
                  </span>
                  <ArrowRight size={15} className="industry-row__arrow" />
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTION 05 — WHY CHOOSE US */}
      <section className="section section--navy" aria-labelledby="why-heading">
        <div className="container">
          <Reveal>
            <div className="section-header">
              <div className="section-header__copy">
                <span className="eyebrow eyebrow--light">Why Choose Us</span>
                <h2 id="why-heading" className="heading-lg">
                  Dependable Sourcing Built Around Your Operations
                </h2>
              </div>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <div className="why-grid">
              {homepageWhy.map((item, idx) => {
                const Icon = WHY_ICONS[item.id as keyof typeof WHY_ICONS] ?? Layers;
                return (
                  <div key={item.id} className="why-item">
                    <div className="why-item__top">
                      <Icon size={24} strokeWidth={1.6} className="why-item__icon" />
                      <span className="why-item__idx">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="why-item__title">{item.title}</h3>
                    <p className="why-item__desc">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTION 06 — ANIMATED PROCUREMENT PROCESS TIMELINE */}
      <section className="section section--white" aria-labelledby="process-heading">
        <div className="container">
          <Reveal>
            <div className="section-header">
              <div className="section-header__copy">
                <span className="eyebrow">Our Procurement Process</span>
                <h2 id="process-heading" className="heading-lg">
                  From Requirement to Supply.
                </h2>
              </div>
            </div>
          </Reveal>

          <div
            ref={timelineRef}
            className={`process-timeline ${
              timelineActive ? 'process-timeline--active' : ''
            }`}
          >
            <div className="process-timeline__track" aria-hidden="true">
              <div className="process-timeline__fill" />
            </div>

            <div className="process-grid">
              {PROCUREMENT_STEPS.map((step) => (
                <div key={step.step} className="process-step">
                  <div className="process-step__marker">{step.step}</div>
                  <h3 className="process-step__title">{step.title}</h3>
                  <p className="process-step__desc">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 07 — VISION & MISSION */}
      <section className="section section--alt" aria-labelledby="vm-heading">
        <div className="container">
          <Reveal>
            <span id="vm-heading" className="eyebrow">
              Direction &amp; Purpose
            </span>
          </Reveal>
          <Reveal delay={90}>
            <div className="vm-grid">
              <div className="vm-card">
                <span className="vm-card__label">Our Vision</span>
                <h2 className="vm-card__title">Preferred Industrial Supply Partner</h2>
                <p className="body-md">{COMPANY.vision}</p>
              </div>
              <div className="vm-card vm-card--accent">
                <span className="vm-card__label">Our Mission</span>
                <h2 className="vm-card__title">Operational Continuity &amp; Efficiency</h2>
                <p className="body-md" style={{ color: 'rgba(255,255,255,0.78)' }}>
                  {COMPANY.mission}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTION 08 — FINAL CTA */}
      <CTASection />
    </Layout>
  );
}
