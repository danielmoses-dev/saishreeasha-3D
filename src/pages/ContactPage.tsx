import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { Layout } from '../components/Layout';
import { Reveal } from '../components/Reveal';
import { COMPANY, PRODUCT_CATEGORIES } from '../data/companyData';
import './InnerPages.css';

export function ContactPage() {
  const [searchParams] = useSearchParams();
  const preselectedCategory = searchParams.get('category') ?? '';

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    category: preselectedCategory,
    details: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Layout hasHero>
      <section className="page-hero">
        <div className="container">
          <div className="page-hero__inner">
            <span className="eyebrow eyebrow--light">Contact &amp; Enquiries</span>
            <h1 className="heading-xl page-hero__title">Request a Quote</h1>
            <p className="page-hero__lead">
              Submit your product requirements and technical specifications. Our procurement team
              will review your enquiry and coordinate suitable sourcing options.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="contact-grid">
            <Reveal>
              <div className="enquiry-form">
                <h2 className="heading-md" style={{ marginBottom: '0.5rem' }}>
                  Industrial Supply Enquiry Form
                </h2>
                <p className="body-md" style={{ marginBottom: '2rem' }}>
                  Complete the details below so we can prepare an accurate quotation.
                </p>

                {submitted ? (
                  <div className="form-success" role="status">
                    <h3 className="heading-md" style={{ marginBottom: '0.5rem' }}>
                      Enquiry Recorded (Demo Preview)
                    </h3>
                    <p className="body-md" style={{ marginBottom: '1.25rem' }}>
                      Thank you, <strong>{formData.name}</strong>. Your requirement for{' '}
                      <strong>{formData.category || 'Industrial Supplies'}</strong> has been
                      captured in this demo interface. In production, this form routes directly to
                      the SAISHREEASHA procurement desk.
                    </p>
                    <button
                      type="button"
                      className="btn btn--dark"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          company: '',
                          email: '',
                          phone: '',
                          category: '',
                          details: '',
                        });
                      }}
                    >
                      Submit Another Enquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="name" className="form-label">
                          Full Name *
                        </label>
                        <input
                          id="name"
                          type="text"
                          required
                          className="form-control"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="company" className="form-label">
                          Company / Organisation *
                        </label>
                        <input
                          id="company"
                          type="text"
                          required
                          className="form-control"
                          placeholder="Company name"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="email" className="form-label">
                          Business Email *
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          className="form-control"
                          placeholder="name@company.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="phone" className="form-label">
                          Phone Number *
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          required
                          className="form-control"
                          placeholder="+91 ..."
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="category" className="form-label">
                        Product Category *
                      </label>
                      <select
                        id="category"
                        required
                        className="form-control"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="">Select a product category</option>
                        {PRODUCT_CATEGORIES.map((cat) => (
                          <option key={cat.slug} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                        <option value="Multiple Categories / General Procurement">
                          Multiple Categories / General Procurement
                        </option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="details" className="form-label">
                        Requirement Details &amp; Specifications *
                      </label>
                      <textarea
                        id="details"
                        required
                        className="form-control"
                        placeholder="Describe required items, material grades, dimensions, quantities, or application..."
                        value={formData.details}
                        onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      />
                    </div>

                    <button type="submit" className="btn btn--primary">
                      Submit Enquiry
                      <ArrowRight size={16} />
                    </button>
                  </form>
                )}
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div>
                <div className="office-card">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.6rem',
                      color: 'var(--color-amber)',
                    }}
                  >
                    <MapPin size={18} />
                    <span
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Pune, Maharashtra
                    </span>
                  </div>
                  <h2 className="office-card__title">{COMPANY.offices.corporate.title}</h2>
                  <address className="office-card__address">
                    {COMPANY.offices.corporate.lines.map((line, idx) => (
                      <span key={idx}>
                        {line}
                        {idx < COMPANY.offices.corporate.lines.length - 1 && <br />}
                      </span>
                    ))}
                  </address>
                </div>

                <div className="office-card">
                  <h2 className="office-card__title">{COMPANY.offices.registered.title}</h2>
                  <address className="office-card__address">
                    {COMPANY.offices.registered.lines.map((line, idx) => (
                      <span key={idx}>
                        {line}
                        {idx < COMPANY.offices.registered.lines.length - 1 && <br />}
                      </span>
                    ))}
                  </address>
                </div>

                <iframe
                  title="Pune Office Location — Gera Imperium Gateway, Bhosari"
                  className="map-frame"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=73.8100%2C18.6100%2C73.8550%2C18.6450&layer=mapnik"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </Layout>
  );
}
