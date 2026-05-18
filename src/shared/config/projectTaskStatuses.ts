import type {
    ProjectTaskPriority,
    ProjectTaskStatus,
  } from '../types/projectTask';
  
  export const PROJECT_TASK_STATUS_LABELS: Record<ProjectTaskStatus, string> = {
    TODO: 'К выполнению',
    IN_PROGRESS: 'В работе',
    DONE: 'Готово',
    BLOCKED: 'Заблокирована',
  };
  
  export const PROJECT_TASK_STATUS_OPTIONS: Array<{
    value: ProjectTaskStatus;
    label: string;
  }> = [
    { value: 'TODO', label: 'К выполнению' },
    { value: 'IN_PROGRESS', label: 'В работе' },
    { value: 'DONE', label: 'Готово' },
    { value: 'BLOCKED', label: 'Заблокирована' },
  ];
  
  export const PROJECT_TASK_PRIORITY_LABELS: Record<ProjectTaskPriority, string> = {
    LOW: 'Низкий',
    MEDIUM: 'Средний',
    HIGH: 'Высокий',
  };
  
  export const PROJECT_TASK_PRIORITY_OPTIONS: Array<{
    value: ProjectTaskPriority;
    label: string;
  }> = [
    { value: 'LOW', label: 'Низкий' },
    { value: 'MEDIUM', label: 'Средний' },
    { value: 'HIGH', label: 'Высокий' },
  ];