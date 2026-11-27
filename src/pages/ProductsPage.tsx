import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { Layout } from '../components/Layout';
import { Reveal } from '../components/Reveal';
import { CTASection } from '../components/CTASection';
import { FEATURED_EQUIPMENT } from '../data/companyData';
import './InnerPages.css';

export function ProductsPage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [hash]);

  return (
    <Layout hasHero>
      <section className="page-hero page-hero--with-bg">
        <img src="/images/cat-process-plant.jpg" alt="" className="page-hero__bg" />
        <div className="page-hero__overlay" aria-hidden="true" />
        <div className="container">
          <div className="page-hero__inner">
            <span className="eyebrow eyebrow--light">Products &amp; Solutions</span>
            <h1 className="heading-xl page-hero__title">Core Industrial Equipment</h1>
            <p className="page-hero__lead">
              Application-ready industrial machinery, partner-brand tools, and surface-preparation
              systems — including DeWalt, Magin Ltd, and Graco.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="catalog-stack">
            {FEATURED_EQUIPMENT.map((item) => (
              <Reveal key={item.slug}>
                <article id={item.slug} className="catalog-item">
                  <div className="catalog-item__stage">
                    <span className="catalog-item__code">LINE {item.code}</span>
                    {item.brand && (
                      <span className="catalog-item__brand">{item.brand}</span>
                    )}
                    <img src={item.image} alt={item.imageAlt} loading="lazy" />
                  </div>

                  <div className="catalog-item__body">
                    <h2 className="heading-md catalog-item__title">{item.name}</h2>
                    <p className="body-md catalog-item__overview">{item.overview}</p>

                    <div className="catalog-item__cols">
                      <div>
                        <h3 className="catalog-item__subhead">Equipment &amp; Accessories</h3>
                        <ul className="catalog-item__list">
                          {item.items.map((entry, idx) => (
                            <li key={idx}>
                              <Check size={15} className="catalog-item__check" aria-hidden="true" />
                              <span>{entry}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="catalog-item__subhead">Key Applications</h3>
                        <div className="catalog-item__tags">
                          {item.applications.map((app, idx) => (
                            <span key={idx} className="catalog-item__tag">
                              {app}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="catalog-item__actions">
                      <Link to="/contact" className="btn btn--primary">
                        Request a Quote
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
}
