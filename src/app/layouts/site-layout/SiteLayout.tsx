import { NavLink, Outlet } from 'react-router-dom';
import { Container } from '../../../shared/ui/container/Container';
import { Button } from '../../../shared/ui/button/Button';
import './SiteLayout.css';

const getNavLinkClassName = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'site-nav__link site-nav__link--active' : 'site-nav__link';

export const SiteLayout = () => {
  return (
    <div className="site-layout">
      <header className="site-header">
        <Container>
          <div className="site-header__inner">
            <NavLink to="/" className="site-logo">
              AuditPro
            </NavLink>

            <nav className="site-nav">
              <NavLink to="/" end className={getNavLinkClassName}>
                Главная
              </NavLink>
              <NavLink to="/services" className={getNavLinkClassName}>
                Услуги
              </NavLink>
              <NavLink to="/about" className={getNavLinkClassName}>
                О компании
              </NavLink>
            </nav>

            <a href="#contact-form">
              <Button variant="outline">Оставить заявку</Button>
            </a>
          </div>
        </Container>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <Container>
          <div className="site-footer__inner">
            <div>
              <div className="site-logo site-logo--footer">AuditPro</div>
              <p className="site-footer__text">
                Корпоративный сайт аудиторской компании с интерактивными сервисами.
              </p>
            </div>

            <div className="site-footer__contacts">
              <a href="mailto:info@auditpro.com">info@auditpro.com</a>
              <a href="tel:+996700000000">+996 (700) 000-000</a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
};