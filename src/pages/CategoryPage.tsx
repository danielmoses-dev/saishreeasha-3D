import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Layout } from '../components/Layout';
import { Reveal } from '../components/Reveal';
import { CTASection } from '../components/CTASection';
import { PRODUCT_CATEGORIES } from '../data/companyData';
import './InnerPages.css';

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = PRODUCT_CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    return <Navigate to="/products" replace />;
  }

  return (
    <Layout hasHero>
      <section className="page-hero page-hero--with-bg">
        <img src={category.image} alt="" className="page-hero__bg" />
        <div className="page-hero__overlay" aria-hidden="true" />
        <div className="container">
          <div className="page-hero__inner">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <ChevronRight size={14} />
              <Link to="/products">Products &amp; Solutions</Link>
              <ChevronRight size={14} />
              <span>Category {category.code}</span>
            </nav>
            <h1 className="heading-xl page-hero__title">{category.name}</h1>
            <p className="page-hero__lead">{category.intro}</p>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="category-layout">
            <div>
              <Reveal>
                <div
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    padding: '2.25rem',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '2rem',
                  }}
                >
                  <span className="eyebrow">Product Range</span>
                  <h2 className="heading-lg">Relevant Product Types</h2>
                  <ul className="spec-list">
                    {category.items.map((item, idx) => (
                      <li key={idx}>
                        <span className="spec-list__bullet" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={80}>
                <div
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    padding: '2.25rem',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <span className="eyebrow">Application Areas</span>
                  <h2 className="heading-lg">Typical Industrial Applications</h2>
                  <ul className="spec-list">
                    {category.applications.map((app, idx) => (
                      <li key={idx}>
                        <span className="spec-list__bullet" aria-hidden="true" />
                        <span>{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>

            <aside className="category-sidebar">
              <div className="sidebar-box sidebar-box--dark">
                <h2 className="sidebar-box__title" style={{ color: 'var(--color-surface)' }}>
                  Request Product Quote
                </h2>
                <p
                  className="body-md"
                  style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '1.5rem' }}
                >
                  Share your technical specifications, dimensions, or operating conditions for
                  application-oriented sourcing.
                </p>
                <Link
                  to={`/contact?category=${encodeURIComponent(category.name)}`}
                  className="btn btn--primary"
                  style={{ width: '100%' }}
                >
                  Enquire About This Category
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="sidebar-box">
                <h2 className="sidebar-box__title">All Product Categories</h2>
                <ul className="sidebar-links">
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        to={`/products/${cat.slug}`}
                        className={cat.slug === category.slug ? 'is-active' : ''}
                      >
                        <span>
                          {cat.code}. {cat.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
}
