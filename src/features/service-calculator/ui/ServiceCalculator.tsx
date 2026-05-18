import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../../shared/ui/button/Button';
import {
  annualRevenueOptions,
  companySizeOptions,
  documentsStateOptions,
  employeesCountOptions,
  serviceTypeOptions,
  urgencyOptions,
  type ServiceCalculatorValues,
} from '../model/serviceCalculatorSchema';
import {
  calculateServicePrice,
  type ServiceCalculatorResult,
} from '../model/calculateServicePrice';
import './ServiceCalculator.css';

const defaultValues: ServiceCalculatorValues = {
  serviceType: 'MANDATORY_AUDIT',
  companySize: 'SMALL',
  annualRevenue: 'LOW',
  employeesCount: 'UP_TO_10',
  urgency: 'STANDARD',
  documentsState: 'ORDERED',
  needAdditionalConsulting: false,
};

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('ru-RU').format(value);
};

export const ServiceCalculator = () => {
  const [result, setResult] = useState<ServiceCalculatorResult | null>(
    calculateServicePrice(defaultValues),
  );

  const { register, handleSubmit, reset } = useForm<ServiceCalculatorValues>({
    defaultValues,
  });

  const onSubmit = (values: ServiceCalculatorValues) => {
    const nextResult = calculateServicePrice(values);
    setResult(nextResult);
  };

  const handleReset = () => {
    reset(defaultValues);
    setResult(calculateServicePrice(defaultValues));
  };

  return (
    <div className="service-calculator">
      <form
        className="service-calculator__form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="service-calculator__grid">
          <label className="service-calculator-field">
            <span>Тип услуги</span>
            <select {...register('serviceType')}>
              {serviceTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="service-calculator-field">
            <span>Размер компании</span>
            <select {...register('companySize')}>
              {companySizeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="service-calculator-field">
            <span>Годовой оборот</span>
            <select {...register('annualRevenue')}>
              {annualRevenueOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="service-calculator-field">
            <span>Количество сотрудников</span>
            <select {...register('employeesCount')}>
              {employeesCountOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="service-calculator-field">
            <span>Срок выполнения</span>
            <select {...register('urgency')}>
              {urgencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="service-calculator-field">
            <span>Состояние документов</span>
            <select {...register('documentsState')}>
              {documentsStateOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="service-calculator-checkbox">
          <input type="checkbox" {...register('needAdditionalConsulting')} />
          <span>Нужны дополнительные консультации специалиста</span>
        </label>

        <div className="service-calculator__actions">
          <Button type="submit">Рассчитать стоимость</Button>

          <Button type="button" variant="outline" onClick={handleReset}>
            Сбросить
          </Button>
        </div>
      </form>

      <aside className="service-calculator-result">
        <span className="service-calculator-result__eyebrow">
          Предварительный расчёт
        </span>

        {result ? (
          <>
            <div className="service-calculator-result__price">
              от {formatPrice(result.minPrice)} до{' '}
              {formatPrice(result.maxPrice)} сом
            </div>

            <div className="service-calculator-result__items">
              <div>
                <span>Ориентировочный срок</span>
                <strong>{result.duration}</strong>
              </div>

              <div>
                <span>Сложность проекта</span>
                <strong>{result.complexity}</strong>
              </div>
            </div>

            <p>{result.recommendation}</p>

            <div className="service-calculator-result__note">
              Итоговая стоимость уточняется после анализа документов и задачи
              клиента.
            </div>
          </>
        ) : (
          <p>Заполните параметры, чтобы получить предварительную оценку.</p>
        )}
      </aside>
    </div>
  );
};