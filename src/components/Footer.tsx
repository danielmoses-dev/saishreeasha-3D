import { Link } from 'react-router-dom';
import { COMPANY, FEATURED_EQUIPMENT } from '../data/companyData';
import './Footer.css';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="footer__brand">
              <span className="navbar__mark" aria-hidden="true" />
              <span>{COMPANY.shortName}</span>
            </div>
            <p className="footer__legal">{COMPANY.legalName}</p>
            <p className="footer__desc">
              Industrial trading, procurement, and supply partner providing industrial equipment,
              process plant spares, engineering materials, and maintenance consumables.
            </p>
          </div>

          <div>
            <h2 className="footer__heading">Navigation</h2>
            <ul className="footer__list">
              <li>
                <Link to="/" className="footer__link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer__link">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/products" className="footer__link">
                  Products &amp; Solutions
                </Link>
              </li>
              <li>
                <Link to="/industries" className="footer__link">
                  Industries Served
                </Link>
              </li>
              <li>
                <Link to="/contact" className="footer__link">
                  Contact &amp; Quote Request
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="footer__heading">Product Portfolio</h2>
            <ul className="footer__list">
              {FEATURED_EQUIPMENT.map((item) => (
                <li key={item.slug}>
                  <Link to={item.to} className="footer__link">
                    {item.brand ? `${item.name} (${item.brand})` : item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="footer__heading">Office Locations</h2>
            <div className="footer__offices">
              <div>
                <h3 className="footer__office-title">{COMPANY.offices.registered.title}</h3>
                <address className="footer__address">
                  {COMPANY.offices.registered.lines.map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < COMPANY.offices.registered.lines.length - 1 && <br />}
                    </span>
                  ))}
                </address>
              </div>
              <div>
                <h3 className="footer__office-title">{COMPANY.offices.corporate.title}</h3>
                <address className="footer__address">
                  {COMPANY.offices.corporate.lines.map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < COMPANY.offices.corporate.lines.length - 1 && <br />}
                    </span>
                  ))}
                </address>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            &copy; {year} {COMPANY.legalName}. All rights reserved.
          </p>
          <p>{COMPANY.motto}</p>
        </div>
      </div>
    </footer>
  );
}
