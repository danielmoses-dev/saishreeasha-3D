import { Check } from 'lucide-react';
import { Layout } from '../components/Layout';
import { Reveal } from '../components/Reveal';
import { CTASection } from '../components/CTASection';
import { COMPANY, WHY_CHOOSE_US } from '../data/companyData';
import './InnerPages.css';

export function AboutPage() {
  return (
    <Layout hasHero>
      <section className="page-hero page-hero--with-bg">
        <img src="/images/about-plant.jpg" alt="" className="page-hero__bg" />
        <div className="page-hero__overlay" aria-hidden="true" />
        <div className="container">
          <div className="page-hero__inner">
            <span className="eyebrow eyebrow--light">About Our Company</span>
            <h1 className="heading-xl page-hero__title">
              {COMPANY.legalName}
            </h1>
            <p className="page-hero__lead">{COMPANY.tagline}</p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="section section--white">
        <div className="container">
          <div className="about-split">
            <Reveal>
              <div>
                <span className="eyebrow">Company Overview</span>
                <h2 className="heading-lg" style={{ marginBottom: '1.5rem' }}>
                  Dependable Single-Window Industrial Sourcing
                </h2>
                <div className="about-paragraphs">
                  {COMPANY.overviewParagraphs.map((para, idx) => (
                    <p key={idx} className="body-md">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="about-media">
                <img
                  src="/images/cat-process-plant.jpg"
                  alt="Industrial process piping infrastructure"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Business Philosophy */}
      <section className="section section--navy">
        <div className="container">
          <Reveal>
            <div style={{ maxWidth: '820px' }}>
              <span className="eyebrow eyebrow--light">Our Business Philosophy</span>
              <h2 className="heading-lg" style={{ marginBottom: '1.75rem' }}>
                {COMPANY.philosophyHeadline}
              </h2>
              <div className="about-paragraphs">
                {COMPANY.philosophyParagraphs.map((para, idx) => (
                  <p key={idx} className="body-lg">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section section--alt">
        <div className="container">
          <Reveal>
            <div className="vm-grid">
              <div className="vm-card">
                <h2 className="vm-card__title">Our Vision</h2>
                <p className="body-md">{COMPANY.vision}</p>
              </div>
              <div className="vm-card vm-card--accent">
                <h2 className="vm-card__title">Our Mission</h2>
                <p className="body-md">{COMPANY.mission}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Commitment */}
      <section className="section section--white">
        <div className="container">
          <div className="commitment-grid">
            <Reveal>
              <div>
                <span className="eyebrow">Our Commitment</span>
                <h2 className="heading-lg" style={{ marginBottom: '1.25rem' }}>
                  Creating Lasting Business Value
                </h2>
                <p className="body-lg" style={{ marginBottom: '1.25rem' }}>
                  {COMPANY.commitmentIntro}
                </p>
                <p className="body-md">{COMPANY.commitmentClosing}</p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div>
                <h3 className="heading-md" style={{ marginBottom: '1rem' }}>
                  We are committed to:
                </h3>
                <ul className="commitment-list">
                  {COMPANY.commitments.map((item, idx) => (
                    <li key={idx}>
                      <Check size={18} className="commitment-list__icon" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section section--alt">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Why Choose Us</span>
            <h2 className="heading-lg" style={{ marginBottom: '2.5rem' }}>
              Why Choose {COMPANY.legalName}
            </h2>
          </Reveal>
          <div className="directory-grid">
            {WHY_CHOOSE_US.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  padding: '2rem',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <h3 className="heading-md" style={{ marginBottom: '0.65rem' }}>
                  {item.title}
                </h3>
                <p className="body-md">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
}
