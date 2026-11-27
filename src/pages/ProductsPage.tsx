import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Layout } from '../components/Layout';
import { Reveal } from '../components/Reveal';
import { CTASection } from '../components/CTASection';
import { PRODUCT_CATEGORIES } from '../data/companyData';
import './InnerPages.css';

export function ProductsPage() {
  return (
    <Layout hasHero>
      <section className="page-hero page-hero--with-bg">
        <img src="/images/cat-process-plant.jpg" alt="" className="page-hero__bg" />
        <div className="page-hero__overlay" aria-hidden="true" />
        <div className="container">
          <div className="page-hero__inner">
            <span className="eyebrow eyebrow--light">Products &amp; Solutions</span>
            <h1 className="heading-xl page-hero__title">Core Industrial Product Portfolio</h1>
            <p className="page-hero__lead">
              Comprehensive sourcing across ten specialized categories — from process plant spares
              and industrial piping to valves, instrumentation, welding, and surface preparation.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="directory-grid">
            {PRODUCT_CATEGORIES.map((category) => (
              <Reveal key={category.slug}>
                <Link to={`/products/${category.slug}`} className="directory-card">
                  <div className="directory-card__media">
                    <img src={category.image} alt={category.imageAlt} loading="lazy" />
                    <span className="directory-card__code">CAT {category.code}</span>
                  </div>
                  <div className="directory-card__body">
                    <h2 className="directory-card__title">{category.name}</h2>
                    <p className="directory-card__desc">{category.intro}</p>
                    <div className="directory-card__footer">
                      <span>View Specifications &amp; Range</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
}
