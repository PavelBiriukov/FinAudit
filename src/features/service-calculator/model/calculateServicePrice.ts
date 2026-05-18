import type { ServiceCalculatorValues } from './serviceCalculatorSchema';

export type ServiceCalculatorResult = {
  minPrice: number;
  maxPrice: number;
  duration: string;
  complexity: string;
  recommendation: string;
};

const basePrices: Record<ServiceCalculatorValues['serviceType'], number> = {
  MANDATORY_AUDIT: 120_000,
  INITIATIVE_AUDIT: 90_000,
  TAX_CONSULTING: 60_000,
  FINANCIAL_ANALYSIS: 70_000,
};

const companySizeMultiplier: Record<ServiceCalculatorValues['companySize'], number> = {
  SMALL: 1,
  MEDIUM: 1.45,
  LARGE: 2.1,
};

const revenueMultiplier: Record<ServiceCalculatorValues['annualRevenue'], number> = {
  LOW: 1,
  MEDIUM: 1.25,
  HIGH: 1.6,
  ENTERPRISE: 2.2,
};

const employeesMultiplier: Record<ServiceCalculatorValues['employeesCount'], number> = {
  UP_TO_10: 1,
  UP_TO_50: 1.2,
  UP_TO_250: 1.55,
  MORE_THAN_250: 2,
};

const urgencyMultiplier: Record<ServiceCalculatorValues['urgency'], number> = {
  STANDARD: 1,
  FAST: 1.25,
  URGENT: 1.55,
};

const documentsMultiplier: Record<ServiceCalculatorValues['documentsState'], number> = {
  ORDERED: 1,
  PARTIAL: 1.2,
  MESSY: 1.45,
};

const roundToThousands = (value: number) => {
  return Math.round(value / 1000) * 1000;
};

const getDuration = (values: ServiceCalculatorValues) => {
  if (values.urgency === 'URGENT') {
    return '3–5 рабочих дней';
  }

  if (values.companySize === 'LARGE' || values.annualRevenue === 'ENTERPRISE') {
    return '15–25 рабочих дней';
  }

  if (values.companySize === 'MEDIUM') {
    return '10–15 рабочих дней';
  }

  return '5–10 рабочих дней';
};

const getComplexity = (values: ServiceCalculatorValues) => {
  const isHighComplexity =
    values.companySize === 'LARGE' ||
    values.annualRevenue === 'ENTERPRISE' ||
    values.documentsState === 'MESSY';

  if (isHighComplexity) {
    return 'Высокая сложность';
  }

  const isMediumComplexity =
    values.companySize === 'MEDIUM' ||
    values.annualRevenue === 'HIGH' ||
    values.documentsState === 'PARTIAL';

  if (isMediumComplexity) {
    return 'Средняя сложность';
  }

  return 'Базовая сложность';
};

const getRecommendation = (values: ServiceCalculatorValues) => {
  if (values.documentsState === 'MESSY') {
    return 'Перед началом работ лучше провести предварительный анализ документов.';
  }

  if (values.urgency === 'URGENT') {
    return 'Из-за срочности стоимость выше. Рекомендуется заранее подготовить документы.';
  }

  if (values.needAdditionalConsulting) {
    return 'Дополнительные консультации лучше включить в отдельный этап сопровождения.';
  }

  return 'Предварительная оценка подходит для первичного обсуждения с менеджером.';
};

export const calculateServicePrice = (
  values: ServiceCalculatorValues,
): ServiceCalculatorResult => {
  const basePrice = basePrices[values.serviceType];

  let calculatedPrice =
    basePrice *
    companySizeMultiplier[values.companySize] *
    revenueMultiplier[values.annualRevenue] *
    employeesMultiplier[values.employeesCount] *
    urgencyMultiplier[values.urgency] *
    documentsMultiplier[values.documentsState];

  if (values.needAdditionalConsulting) {
    calculatedPrice += 25_000;
  }

  return {
    minPrice: roundToThousands(calculatedPrice * 0.85),
    maxPrice: roundToThousands(calculatedPrice * 1.15),
    duration: getDuration(values),
    complexity: getComplexity(values),
    recommendation: getRecommendation(values),
  };
};