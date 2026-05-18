import { Link } from 'react-router-dom';
import { Container } from '../../../shared/ui/container/Container';
import { SectionTitle } from '../../../shared/ui/section-title/SectionTitle';
import { ContactRequestForm } from '../../../features/contact-request';
import { services } from '../../../shared/config/services';
import './HomePage.css';

const servicesPreview = services.slice(0, 3);

const advantages = [
  'Понятная коммуникация без лишней бюрократии',
  'Контроль этапов проекта и прозрачность работ',
  'Экспертность в аудите, налогах и отчетности',
  'Безопасная работа с клиентскими документами',
];

export const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <Container>
          <div className="hero__content">
            <div className="hero__left">
              <span className="hero__badge">Аудиторская компания полного цикла</span>

              <h1 className="hero__title">
                Надёжный аудит, финансовый контроль и сопровождение бизнеса
              </h1>

              <p className="hero__description">
                Помогаем компаниям снижать риски, выстраивать прозрачные процессы и
                уверенно принимать финансовые решения.
              </p>

              <div className="hero__actions">
                <Link to="/contacts" className="button button--primary">
                  Оставить заявку
                </Link>

                <Link to="/services" className="button button--secondary">
                  Наши услуги
                </Link>
              </div>

              <div className="hero__stats">
                <div className="hero-stat">
                  <strong>10+</strong>
                  <span>лет опыта</span>
                </div>
                <div className="hero-stat">
                  <strong>250+</strong>
                  <span>проектов</span>
                </div>
                <div className="hero-stat">
                  <strong>98%</strong>
                  <span>довольных клиентов</span>
                </div>
              </div>
            </div>

            <div className="hero__right">
              <div className="hero-card">
                <h3>Поддержка клиентов</h3>
                <p>
                  Удобная подача заявки, быстрое согласование задач и понятный процесс
                  взаимодействия на каждом этапе.
                </p>
                <ul>
                  <li>Быстрая консультация</li>
                  <li>Понятный старт проекта</li>
                  <li>Персональное сопровождение</li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="section">
        <Container>
          <SectionTitle
            eyebrow="Основные направления"
            title="Ключевые услуги компании"
            description="На главной не надо пихать весь каталог. Достаточно показать основные направления и увести человека дальше."
          />

          <div className="cards-grid">
            {servicesPreview.map((service) => (
              <article key={service.id} className="info-card">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>

          <div className="section__actions">
            <Link to="/services" className="button button--outline">
              Смотреть все услуги
            </Link>
          </div>
        </Container>
      </section>

      <section className="section section--gray">
        <Container>
          <SectionTitle
            eyebrow="Почему мы"
            title="Почему клиенту удобно работать с нами"
            description="Здесь продаётся доверие, а не просто список абстрактных преимуществ."
          />

          <div className="advantages-list">
            {advantages.map((item) => (
              <div key={item} className="advantage-item">
                <span className="advantage-item__icon">✓</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="section">
        <Container>
          <SectionTitle
            eyebrow="Заявка"
            title="Свяжись с нами"
            description="Теперь форма уже не декоративная: она валидируется и реально отправляет данные на API."
          />

          <ContactRequestForm />
        </Container>
      </section>
    </div>
  );
};