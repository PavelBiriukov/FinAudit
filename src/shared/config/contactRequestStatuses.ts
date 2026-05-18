import type { ContactRequestStatus } from '../types/contactRequest';

export const CONTACT_REQUEST_STATUS_LABELS: Record<ContactRequestStatus, string> = {
  NEW: 'Новая',
  IN_REVIEW: 'В работе',
  PROCESSED: 'Обработана',
};

export const CONTACT_REQUEST_STATUS_OPTIONS: Array<{
  value: ContactRequestStatus;
  label: string;
}> = [
  { value: 'NEW', label: 'Новая' },
  { value: 'IN_REVIEW', label: 'В работе' },
  { value: 'PROCESSED', label: 'Обработана' },
];

export type ContactRequestStatusFilter = ContactRequestStatus | 'ALL';

export const CONTACT_REQUEST_STATUS_FILTER_OPTIONS: Array<{
  value: ContactRequestStatusFilter;
  label: string;
}> = [
  { value: 'ALL', label: 'Все заявки' },
  { value: 'NEW', label: 'Новые' },
  { value: 'IN_REVIEW', label: 'В работе' },
  { value: 'PROCESSED', label: 'Обработанные' },
];