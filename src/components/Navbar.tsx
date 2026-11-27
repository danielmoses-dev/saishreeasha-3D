import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { COMPANY } from '../data/companyData';
import './Navbar.css';

interface NavbarProps {
  hasHero?: boolean;
}

export function Navbar({ hasHero = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 36);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isSolid = !hasHero || scrolled || mobileOpen;

  const navItems = [
    { to: '/about', label: 'About Us' },
    { to: '/products', label: 'Products & Solutions' },
    { to: '/industries', label: 'Industries' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header className={`navbar ${isSolid ? 'navbar--solid' : 'navbar--transparent'}`}>
        <div className="container navbar__inner">
          <Link to="/" className="navbar__brand" aria-label={COMPANY.legalName}>
            <span className="navbar__mark" aria-hidden="true" />
            <span>{COMPANY.shortName}</span>
          </Link>

          <div className="navbar__right">
            <nav aria-label="Primary Navigation">
              <ul className="navbar__links">
                {navItems.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="navbar__actions">
              <Link to="/contact" className="btn btn--primary navbar__cta navbar__cta--desktop">
                Request a Quote
                <ArrowUpRight size={15} strokeWidth={2} />
              </Link>

              <button
                type="button"
                className="navbar__toggle"
                onClick={() => setMobileOpen((prev) => !prev)}
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${mobileOpen ? 'mobile-menu--open' : ''}`} aria-hidden={!mobileOpen}>
        <ul className="mobile-menu__list">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `mobile-menu__link ${isActive ? 'mobile-menu__link--active' : ''}`
              }
            >
              Home
            </NavLink>
          </li>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `mobile-menu__link ${isActive ? 'mobile-menu__link--active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mobile-menu__footer">
          <Link to="/contact" className="btn btn--primary" style={{ width: '100%' }}>
            Request a Quote
            <ArrowUpRight size={16} />
          </Link>
          <p className="mobile-menu__meta">{COMPANY.legalName}</p>
        </div>
      </div>
    </>
  );
}
