import { Container } from '../../../shared/ui/container/Container';
import { SectionTitle } from '../../../shared/ui/section-title/SectionTitle';
import { ContactRequestForm } from '../../../features/contact-request';
import './ServicesPage.css';

const services = [
  {
    title: 'Обязательный аудит',
    description:
      'Проведение обязательного аудита финансовой отчетности с подготовкой заключения и рекомендаций.',
  },
  {
    title: 'Инициативный аудит',
    description:
      'Проверка по инициативе собственников или руководства для оценки рисков и качества внутреннего контроля.',
  },
  {
    title: 'Налоговый консалтинг',
    description:
      'Анализ налоговой нагрузки, выявление рисков и подготовка решений для безопасной работы компании.',
  },
  {
    title: 'Финансовый анализ',
    description:
      'Оценка финансовой устойчивости, ликвидности, прибыльности и эффективности бизнес-процессов.',
  },
  {
    title: 'Подготовка отчетности',
    description:
      'Методическая помощь в формировании финансовой и управленческой отчетности для бизнеса.',
  },
  {
    title: 'Сопровождение проверок',
    description:
      'Поддержка компании во время внешних и внутренних проверок, помощь в подготовке документов и позиции.',
  },
];

export const ServicesPage = () => {
  return (
    <div className="services-page">
      <section className="inner-hero">
        <Container>
          <SectionTitle
            eyebrow="Услуги"
            title="Услуги аудиторской компании"
            description="Здесь уже можно показать каталог шире, чем на главной. Но всё равно без мусора и без канцелярщины."
          />
        </Container>
      </section>

      <section className="section">
        <Container>
          <div className="services-grid">
            {services.map((service) => (
              <article key={service.title} className="service-card">
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
            description="Если человек дошёл до страницы услуг, ему надо не читать ещё три экрана текста, а дать понятный CTA."
          />

          <ContactRequestForm />
        </Container>
      </section>
    </div>
  );
};