import { Container } from '../../../shared/ui/container/Container';
import { SectionTitle } from '../../../shared/ui/section-title/SectionTitle';
import { ContactRequestForm } from '../../../features/contact-request';
import './ContactsPage.css';

const contactItems = [
  {
    title: 'Email',
    value: 'info@auditpro.com',
    href: 'mailto:info@auditpro.com',
  },
  {
    title: 'Телефон',
    value: '+996 (700) 000-000',
    href: 'tel:+996700000000',
  },
  {
    title: 'Адрес',
    value: 'Бишкек, офис компании AuditPro',
  },
];

export const ContactsPage = () => {
  return (
    <div className="contacts-page">
      <section className="inner-hero">
        <Container>
          <SectionTitle
            eyebrow="Контакты"
            title="Связаться с аудиторской компанией"
            description="Здесь уже должен быть нормальный целевой экран: контакты, форма, понятный следующий шаг."
          />
        </Container>
      </section>

      <section className="section">
        <Container>
          <div className="contacts-page__grid">
            <div className="contacts-page__info">
              {contactItems.map((item) => (
                <article key={item.title} className="contact-card">
                  <h3>{item.title}</h3>

                  {item.href ? (
                    <a href={item.href}>{item.value}</a>
                  ) : (
                    <p>{item.value}</p>
                  )}
                </article>
              ))}

              <div className="contact-note">
                <h3>Как это работает</h3>
                <p>
                  Оставляешь заявку, менеджер связывается с тобой, уточняет задачу,
                  после этого уже согласуются формат работ и сроки.
                </p>
              </div>
            </div>

            <div className="contacts-page__form">
              <ContactRequestForm />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};