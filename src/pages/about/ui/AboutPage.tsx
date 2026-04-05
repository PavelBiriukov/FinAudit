import { Container } from '../../../shared/ui/container/Container';
import { SectionTitle } from '../../../shared/ui/section-title/SectionTitle';
import { ContactRequestForm } from '../../../features/contact-request';
import './AboutPage.css';

const principles = [
  'Прозрачность в коммуникации и отчетности',
  'Ответственность за качество рекомендаций',
  'Конфиденциальность клиентских данных',
  'Ориентация на практический результат, а не формальный отчет',
];

export const AboutPage = () => {
  return (
    <div className="about-page">
      <section className="inner-hero">
        <Container>
          <SectionTitle
            eyebrow="О компании"
            title="Экспертная поддержка бизнеса в вопросах аудита и финансового контроля"
            description="Страница о компании должна не хвалить себя бессмысленно, а объяснять, почему клиенту можно тебе доверять."
          />
        </Container>
      </section>

      <section className="section">
        <Container>
          <div className="about-grid">
            <div className="about-card">
              <h3>Кто мы</h3>
              <p>
                AuditPro — команда специалистов в области аудита, финансового анализа
                и сопровождения бизнеса. Мы помогаем компаниям видеть реальные риски,
                наводить порядок в отчетности и принимать обоснованные решения.
              </p>
            </div>

            <div className="about-card">
              <h3>Как мы работаем</h3>
              <p>
                Мы строим работу на понятных этапах: анализ задачи, согласование
                формата, выполнение работ, обратная связь и практические рекомендации
                для клиента.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="section section--gray">
        <Container>
          <SectionTitle
            eyebrow="Наши принципы"
            title="На чём строится работа с клиентами"
            description="Вместо пустых слов лучше показать базовые рабочие принципы."
          />

          <div className="principles-list">
            {principles.map((item) => (
              <div key={item} className="principle-item">
                <span className="principle-item__icon">✓</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="section">
        <Container>
          <SectionTitle
            eyebrow="Связаться"
            title="Обсудить сотрудничество"
            description="Нормальная страница о компании тоже должна заканчиваться действием, а не обрываться в пустоту."
          />

          <ContactRequestForm />
        </Container>
      </section>
    </div>
  );
};