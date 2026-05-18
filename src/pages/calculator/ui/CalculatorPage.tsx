import { Container } from '../../../shared/ui/container/Container';
import { SectionTitle } from '../../../shared/ui/section-title/SectionTitle';
import { ServiceCalculator } from '../../../features/service-calculator';
import './CalculatorPage.css';

export const CalculatorPage = () => {
  return (
    <div className="calculator-page">
      <section className="inner-hero">
        <Container>
          <SectionTitle
            eyebrow="Интерактивный сервис"
            title="Калькулятор стоимости аудиторских услуг"
            description="Сервис помогает клиенту получить предварительную оценку стоимости работ до обращения к менеджеру."
          />
        </Container>
      </section>

      <section className="section">
        <Container>
          <ServiceCalculator />
        </Container>
      </section>
    </div>
  );
};