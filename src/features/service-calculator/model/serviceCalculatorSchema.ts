export const serviceTypeOptions = [
    { value: 'MANDATORY_AUDIT', label: 'Обязательный аудит' },
    { value: 'INITIATIVE_AUDIT', label: 'Инициативный аудит' },
    { value: 'TAX_CONSULTING', label: 'Налоговый консалтинг' },
    { value: 'FINANCIAL_ANALYSIS', label: 'Финансовый анализ' },
  ] as const;
  
  export const companySizeOptions = [
    { value: 'SMALL', label: 'Малый бизнес' },
    { value: 'MEDIUM', label: 'Средний бизнес' },
    { value: 'LARGE', label: 'Крупный бизнес' },
  ] as const;
  
  export const annualRevenueOptions = [
    { value: 'LOW', label: 'До 10 млн сом' },
    { value: 'MEDIUM', label: '10–100 млн сом' },
    { value: 'HIGH', label: '100–500 млн сом' },
    { value: 'ENTERPRISE', label: 'Более 500 млн сом' },
  ] as const;
  
  export const employeesCountOptions = [
    { value: 'UP_TO_10', label: 'До 10 сотрудников' },
    { value: 'UP_TO_50', label: 'До 50 сотрудников' },
    { value: 'UP_TO_250', label: 'До 250 сотрудников' },
    { value: 'MORE_THAN_250', label: 'Более 250 сотрудников' },
  ] as const;
  
  export const urgencyOptions = [
    { value: 'STANDARD', label: 'Стандартный срок' },
    { value: 'FAST', label: 'Ускоренно' },
    { value: 'URGENT', label: 'Срочно' },
  ] as const;
  
  export const documentsStateOptions = [
    { value: 'ORDERED', label: 'Документы в порядке' },
    { value: 'PARTIAL', label: 'Часть документов требует проверки' },
    { value: 'MESSY', label: 'Документы нужно приводить в порядок' },
  ] as const;
  
  export type ServiceType = (typeof serviceTypeOptions)[number]['value'];
  export type CompanySize = (typeof companySizeOptions)[number]['value'];
  export type AnnualRevenue = (typeof annualRevenueOptions)[number]['value'];
  export type EmployeesCount = (typeof employeesCountOptions)[number]['value'];
  export type Urgency = (typeof urgencyOptions)[number]['value'];
  export type DocumentsState = (typeof documentsStateOptions)[number]['value'];
  
  export type ServiceCalculatorValues = {
    serviceType: ServiceType;
    companySize: CompanySize;
    annualRevenue: AnnualRevenue;
    employeesCount: EmployeesCount;
    urgency: Urgency;
    documentsState: DocumentsState;
    needAdditionalConsulting: boolean;
  };