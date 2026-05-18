import { FormEvent } from 'react';
import { Button } from '../../../shared/ui/button/Button';
import { Input } from '../../../shared/ui/input/Input';
import { Textarea } from '../../../shared/ui/textarea/Textarea';
import {
  PROJECT_TASK_PRIORITY_LABELS,
  PROJECT_TASK_PRIORITY_OPTIONS,
  PROJECT_TASK_STATUS_LABELS,
  PROJECT_TASK_STATUS_OPTIONS,
} from '../../../shared/config/projectTaskStatuses';
import type {
  ProjectTask,
  ProjectTaskPriority,
  ProjectTaskStatus,
} from '../../../shared/types/projectTask';
import './ProjectTasksPanel.css';

type ProjectTasksPanelProps = {
  tasks: ProjectTask[];
  isLoading: boolean;
  error?: string;
  mode: 'ADMIN' | 'CLIENT';

  title: string;
  taskTitle?: string;
  taskDescription?: string;
  taskPriority?: ProjectTaskPriority;
  isCreating?: boolean;
  activeTaskId?: string | null;

  onTaskTitleChange?: (value: string) => void;
  onTaskDescriptionChange?: (value: string) => void;
  onTaskPriorityChange?: (value: ProjectTaskPriority) => void;
  onCreateTask?: () => Promise<void> | void;
  onStatusChange?: (
    taskId: string,
    status: ProjectTaskStatus,
  ) => Promise<void> | void;
};

const formatDate = (value: string) =>
  new Date(value).toLocaleString('ru-RU', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

export const ProjectTasksPanel = ({
  tasks,
  isLoading,
  error,
  mode,
  title,
  taskTitle = '',
  taskDescription = '',
  taskPriority = 'MEDIUM',
  isCreating = false,
  activeTaskId = null,
  onTaskTitleChange,
  onTaskDescriptionChange,
  onTaskPriorityChange,
  onCreateTask,
  onStatusChange,
}: ProjectTasksPanelProps) => {
  const handleCreateSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (onCreateTask) {
      void onCreateTask();
    }
  };

  return (
    <div className="project-tasks-panel">
      <h2>{title}</h2>

      {mode === 'ADMIN' ? (
        <form className="project-task-form" onSubmit={handleCreateSubmit}>
          <Input
            label="Название задачи"
            placeholder="Например: Подготовить договор"
            value={taskTitle}
            onChange={(event) => onTaskTitleChange?.(event.target.value)}
            disabled={isCreating}
          />

          <Textarea
            label="Описание"
            placeholder="Кратко опиши, что нужно сделать"
            value={taskDescription}
            onChange={(event) => onTaskDescriptionChange?.(event.target.value)}
            disabled={isCreating}
          />

          <label className="project-task-field">
            <span>Приоритет</span>

            <select
              value={taskPriority}
              disabled={isCreating}
              onChange={(event) =>
                onTaskPriorityChange?.(event.target.value as ProjectTaskPriority)
              }
            >
              {PROJECT_TASK_PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <Button type="submit" disabled={isCreating || !taskTitle.trim()}>
            {isCreating ? 'Создание...' : 'Создать задачу'}
          </Button>
        </form>
      ) : null}

      {error ? <p className="project-tasks-error">{error}</p> : null}

      {isLoading ? (
        <div className="project-tasks-empty">Загрузка задач...</div>
      ) : null}

      {!isLoading && tasks.length === 0 ? (
        <div className="project-tasks-empty">Задач пока нет</div>
      ) : null}

      {!isLoading && tasks.length > 0 ? (
        <div className="project-tasks-list">
          {tasks.map((task) => (
            <article key={task.id} className="project-task-card">
              <div className="project-task-card__top">
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.description || 'Описание не заполнено'}</p>
                </div>

                <span
                  className={`task-priority task-priority--${task.priority.toLowerCase()}`}
                >
                  {PROJECT_TASK_PRIORITY_LABELS[task.priority]}
                </span>
              </div>

              <div className="project-task-card__meta">
                <div>
                  <span>Статус</span>

                  {mode === 'ADMIN' ? (
                    <select
                      value={task.status}
                      disabled={activeTaskId === task.id}
                      onChange={(event) =>
                        onStatusChange?.(
                          task.id,
                          event.target.value as ProjectTaskStatus,
                        )
                      }
                    >
                      {PROJECT_TASK_STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <strong>{PROJECT_TASK_STATUS_LABELS[task.status]}</strong>
                  )}
                </div>

                <div>
                  <span>Создана</span>
                  <strong>{formatDate(task.createdAt)}</strong>
                </div>

                <div>
                  <span>Исполнитель</span>
                  <strong>{task.assigneeAdmin?.email || 'Не назначен'}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
};