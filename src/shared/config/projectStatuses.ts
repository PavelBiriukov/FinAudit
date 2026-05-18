import type { ProjectStatus } from '../types/project';

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  NEW: 'Новый',
  IN_PROGRESS: 'В работе',
  WAITING_FOR_CLIENT: 'Ожидает клиента',
  COMPLETED: 'Завершён',
  ARCHIVED: 'В архиве',
};

export const PROJECT_STATUS_OPTIONS: Array<{
  value: ProjectStatus;
  label: string;
}> = [
  { value: 'NEW', label: 'Новый' },
  { value: 'IN_PROGRESS', label: 'В работе' },
  { value: 'WAITING_FOR_CLIENT', label: 'Ожидает клиента' },
  { value: 'COMPLETED', label: 'Завершён' },
  { value: 'ARCHIVED', label: 'В архиве' },
];