import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Reveal } from '../components/Reveal';
import { CTASection } from '../components/CTASection';
import { INDUSTRIES, PRODUCT_CATEGORIES } from '../data/companyData';
import './InnerPages.css';

export function IndustriesPage() {
  const getCatName = (slug: string) =>
    PRODUCT_CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;

  return (
    <Layout hasHero>
      <section className="page-hero page-hero--with-bg">
        <img src="/images/ind-oil-gas.jpg" alt="" className="page-hero__bg" />
        <div className="page-hero__overlay" aria-hidden="true" />
        <div className="container">
          <div className="page-hero__inner">
            <span className="eyebrow eyebrow--light">Industries We Serve</span>
            <h1 className="heading-xl page-hero__title">
              Application-Oriented Supply Across Industrial Sectors
            </h1>
            <p className="page-hero__lead">
              Our products and sourcing capabilities support industrial plants, engineering
              contractors, fabrication facilities, and maintenance teams across key sectors.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="industries-detail-grid">
            {INDUSTRIES.map((ind) => (
              <Reveal key={ind.slug}>
                <article className="industry-detail-card">
                  <img
                    src={ind.image}
                    alt={ind.name}
                    className="industry-detail-card__img"
                    loading="lazy"
                  />
                  <div className="industry-detail-card__body">
                    <div>
                      <h2 className="heading-md" style={{ marginBottom: '0.6rem' }}>
                        {ind.name}
                      </h2>
                      <p className="body-md">{ind.summary}</p>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: 'var(--color-steel)',
                          marginBottom: '0.5rem',
                        }}
                      >
                        Supported Categories
                      </div>
                      <div className="industry-detail-card__tags">
                        {ind.relevantCategories.map((catSlug) => (
                          <Link
                            key={catSlug}
                            to={`/products/${catSlug}`}
                            className="industry-tag"
                          >
                            {getCatName(catSlug)}
                          </Link>
                        ))}
                      </div>
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
