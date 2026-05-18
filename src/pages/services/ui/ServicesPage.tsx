import { Container } from '../../../shared/ui/container/Container';
import { SectionTitle } from '../../../shared/ui/section-title/SectionTitle';
import { ContactRequestForm } from '../../../features/contact-request';
import { services } from '../../../shared/config/services';
import './ServicesPage.css';
import { Link } from 'react-router-dom';

export const ServicesPage = () => {
  return (
    <div className="services-page">
      <section className="inner-hero">
        <Container>
          <SectionTitle
            eyebrow="Услуги"
            title="Услуги аудиторской компании"
            description="В данном разделе представлен расширенный перечень услуг компании с кратким описанием каждого направления."
          />
        </Container>
      </section>

      <section className="section">
        <Container>
          <div className="services-grid">
            {services.map((service) => (
              <article key={service.id} className="service-card">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="section section--gray">
        <Container>
          <SectionTitle
            eyebrow="Обсудить проект"
            title="Оставь заявку на консультацию"
            description="Если вы заинтересованы в услугах компании, оставьте заявку на консультацию, и специалист свяжется с вами для уточнения деталей."
          />

          <ContactRequestForm />
        </Container>
      </section>
    </div>
  );
};