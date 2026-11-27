import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';
import './CTASection.css';

export function CTASection() {
  return (
    <section className="cta-banner" aria-labelledby="cta-heading">
      <Reveal variant="image" className="cta-banner__bg-wrap">
        <img
          src="/images/ind-oil-gas.jpg"
          alt="Industrial refinery infrastructure"
          className="cta-banner__bg"
          loading="lazy"
        />
      </Reveal>
      <div className="cta-banner__overlay" aria-hidden="true" />
      <div className="container">
        <Reveal>
          <div className="cta-banner__inner">
            <span className="eyebrow eyebrow--light">Procurement Enquiry</span>
            <h2 id="cta-heading" className="heading-lg cta-banner__heading">
              Looking for a Reliable Industrial Supply Partner?
            </h2>
            <p className="body-lg cta-banner__text">
              Tell us what your project needs. Let&apos;s identify the right products and sourcing
              solutions for your requirements.
            </p>
            <div className="cta-banner__actions">
              <Link to="/contact" className="btn btn--primary">
                Request a Quote
                <ArrowRight size={16} />
              </Link>
              <Link to="/contact" className="btn btn--outline-light">
                Contact Our Team
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
