import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Container } from '../../../shared/ui/container/Container';
import { SectionTitle } from '../../../shared/ui/section-title/SectionTitle';
import {
  getAdminProjectById,
  updateAdminProjectStatus,
} from '../../../shared/api/adminProjects';
import {
  createAdminProjectMessage,
  getAdminProjectMessages,
} from '../../../shared/api/adminProjectMessages';
import { uploadAdminProjectDocument } from '../../../shared/api/adminProjectDocuments';
import {
  createAdminProjectTask,
  getAdminProjectTasks,
  updateAdminProjectTaskStatus,
} from '../../../shared/api/adminProjectTasks';
import { ApiError } from '../../../shared/api/base';
import { adminAuthTokenStorage } from '../../../shared/lib/adminAuthTokenStorage';
import { getFileUrl } from '../../../shared/lib/getFileUrl';
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_OPTIONS,
} from '../../../shared/config/projectStatuses';
import { ProjectMessagesPanel } from '../../../features/project-messages';
import { ProjectTasksPanel } from '../../../features/project-tasks';
import type { ProjectDetails, ProjectStatus } from '../../../shared/types/project';
import type { ProjectMessage } from '../../../shared/types/projectMessage';
import type {
  ProjectTask,
  ProjectTaskPriority,
  ProjectTaskStatus,
} from '../../../shared/types/projectTask';
import './AdminProjectDetailsPage.css';

const formatDate = (value: string) =>
  new Date(value).toLocaleString('ru-RU', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

export const AdminProjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
  const [messageText, setMessageText] = useState('');

  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] =
    useState<ProjectTaskPriority>('MEDIUM');
  const [isTasksLoading, setIsTasksLoading] = useState(false);
  const [isTaskCreating, setIsTaskCreating] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [tasksError, setTasksError] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isStatusSubmitting, setIsStatusSubmitting] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [isMessageSubmitting, setIsMessageSubmitting] = useState(false);

  const [error, setError] = useState('');
  const [messagesError, setMessagesError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [documentTitle, setDocumentTitle] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [isDocumentUploading, setIsDocumentUploading] = useState(false);
  const [documentError, setDocumentError] = useState('');

  const handleUnauthorized = () => {
    adminAuthTokenStorage.clearToken();
    navigate('/admin/login', { replace: true });
  };

  const loadMessages = async (projectId: string) => {
    setIsMessagesLoading(true);
    setMessagesError('');

    try {
      const response = await getAdminProjectMessages(projectId);
      setMessages(response.data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        handleUnauthorized();
        return;
      }

      setMessagesError(
        err instanceof Error ? err.message : 'Не удалось загрузить сообщения',
      );
    } finally {
      setIsMessagesLoading(false);
    }
  };

  const loadTasks = async (projectId: string) => {
    setIsTasksLoading(true);
    setTasksError('');

    try {
      const response = await getAdminProjectTasks(projectId);
      setTasks(response.data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        handleUnauthorized();
        return;
      }

      setTasksError(
        err instanceof Error ? err.message : 'Не удалось загрузить задачи',
      );
    } finally {
      setIsTasksLoading(false);
    }
  };

  const loadProject = async () => {
    if (!id) {
      setError('Не передан id проекта');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await getAdminProjectById(id);
      setProject(response.data);
      await loadMessages(id);
      await loadTasks(id);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        handleUnauthorized();
        return;
      }

      setError(
        err instanceof Error ? err.message : 'Не удалось загрузить проект',
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadProject();
  }, [id]);

  const handleStatusChange = async (status: ProjectStatus) => {
    if (!id) {
      return;
    }

    setIsStatusSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await updateAdminProjectStatus(id, status);

      setSuccessMessage(response.message || 'Статус проекта обновлён');
      await loadProject();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        handleUnauthorized();
        return;
      }

      setError(
        err instanceof Error ? err.message : 'Не удалось обновить статус',
      );
    } finally {
      setIsStatusSubmitting(false);
    }
  };

  const handleUploadDocument = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id || !documentTitle.trim() || !documentFile) {
      setDocumentError('Укажи название и выбери файл');
      return;
    }

    setIsDocumentUploading(true);
    setDocumentError('');
    setSuccessMessage('');

    try {
      const response = await uploadAdminProjectDocument(id, {
        title: documentTitle.trim(),
        file: documentFile,
      });

      setSuccessMessage(response.message || 'Документ загружен');
      setDocumentTitle('');
      setDocumentFile(null);

      await loadProject();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        handleUnauthorized();
        return;
      }

      setDocumentError(
        err instanceof Error ? err.message : 'Не удалось загрузить документ',
      );
    } finally {
      setIsDocumentUploading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!id || !messageText.trim()) {
      return;
    }

    setIsMessageSubmitting(true);
    setMessagesError('');

    try {
      await createAdminProjectMessage(id, messageText.trim());
      setMessageText('');
      await loadMessages(id);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        handleUnauthorized();
        return;
      }

      setMessagesError(
        err instanceof Error ? err.message : 'Не удалось отправить сообщение',
      );
    } finally {
      setIsMessageSubmitting(false);
    }
  };

  const handleCreateTask = async () => {
    if (!id || !taskTitle.trim()) {
      return;
    }

    setIsTaskCreating(true);
    setTasksError('');

    try {
      await createAdminProjectTask(id, {
        title: taskTitle.trim(),
        description: taskDescription.trim(),
        priority: taskPriority,
      });

      setTaskTitle('');
      setTaskDescription('');
      setTaskPriority('MEDIUM');

      await loadTasks(id);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        handleUnauthorized();
        return;
      }

      setTasksError(
        err instanceof Error ? err.message : 'Не удалось создать задачу',
      );
    } finally {
      setIsTaskCreating(false);
    }
  };

  const handleTaskStatusChange = async (
    taskId: string,
    status: ProjectTaskStatus,
  ) => {
    setActiveTaskId(taskId);
    setTasksError('');

    try {
      await updateAdminProjectTaskStatus(taskId, status);

      if (id) {
        await loadTasks(id);
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        handleUnauthorized();
        return;
      }

      setTasksError(
        err instanceof Error ? err.message : 'Не удалось обновить статус задачи',
      );
    } finally {
      setActiveTaskId(null);
    }
  };

  return (
    <div className="admin-project-details-page">
      <section className="section">
        <Container>
          <div className="admin-project-details-header">
            <SectionTitle
              eyebrow="CRM"
              title={project?.title || 'Проект'}
              description="Отдельная карточка проекта: статус, клиент, документы, задачи и переписка."
            />

            <div className="admin-project-details-header__actions">
              <Link to="/admin/projects" className="button button--outline">
                Назад к проектам
              </Link>

              {project?.contactRequest ? (
                <Link
                  to={`/admin/requests/${project.contactRequest.id}`}
                  className="button button--outline"
                >
                  Заявка
                </Link>
              ) : null}
            </div>
          </div>

          {isLoading ? (
            <div className="admin-project-details-empty">
              Загрузка проекта...
            </div>
          ) : null}

          {successMessage ? (
            <p className="admin-project-details-feedback admin-project-details-feedback--success">
              {successMessage}
            </p>
          ) : null}

          {error ? (
            <div className="admin-project-details-error">{error}</div>
          ) : null}

          {!isLoading && !error && project ? (
            <div className="admin-project-details-layout">
              <div className="admin-project-details-grid">
                <div className="admin-project-details-card">
                  <h2>Информация о проекте</h2>

                  <div className="admin-project-details-meta">
                    <div>
                      <span>Статус</span>
                      <strong
                        className={`status-badge status-badge--${project.status.toLowerCase()}`}
                      >
                        {PROJECT_STATUS_LABELS[project.status]}
                      </strong>
                    </div>

                    <div>
                      <span>Изменить статус</span>
                      <select
                        value={project.status}
                        disabled={isStatusSubmitting}
                        onChange={(event) =>
                          handleStatusChange(event.target.value as ProjectStatus)
                        }
                      >
                        {PROJECT_STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <span>Клиент</span>
                      <strong>{project.client.fullName}</strong>
                      <small>{project.client.email}</small>
                    </div>

                    <div>
                      <span>Менеджер</span>
                      <strong>
                        {project.manager?.email || 'Пока не назначен'}
                      </strong>
                    </div>

                    <div>
                      <span>Создан</span>
                      <strong>{formatDate(project.createdAt)}</strong>
                    </div>

                    <div>
                      <span>Обновлён</span>
                      <strong>{formatDate(project.updatedAt)}</strong>
                    </div>
                  </div>

                  <div className="admin-project-details-description">
                    <span>Описание</span>
                    <p>
                      {project.description ||
                        'Описание проекта пока не заполнено'}
                    </p>
                  </div>
                </div>

                <div className="admin-project-details-card">
                  <h2>Документы проекта</h2>

                  <form
                    className="admin-project-document-form"
                    onSubmit={handleUploadDocument}
                  >
                    <label className="admin-project-document-field">
                      <span>Название документа</span>
                      <input
                        value={documentTitle}
                        onChange={(event) =>
                          setDocumentTitle(event.target.value)
                        }
                        placeholder="Например: Договор, Акт, Отчёт"
                        disabled={isDocumentUploading}
                      />
                    </label>

                    <label className="admin-project-document-field">
                      <span>Файл</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                        disabled={isDocumentUploading}
                        onChange={(event) => {
                          setDocumentFile(event.target.files?.[0] ?? null);
                        }}
                      />
                    </label>

                    {documentError ? (
                      <p className="admin-project-document-error">
                        {documentError}
                      </p>
                    ) : null}

                    <button
                      type="submit"
                      className="button button--primary"
                      disabled={isDocumentUploading}
                    >
                      {isDocumentUploading
                        ? 'Загрузка...'
                        : 'Загрузить документ'}
                    </button>
                  </form>

                  {project.documents.length === 0 ? (
                    <div className="admin-project-details-empty">
                      Документы пока не добавлены
                    </div>
                  ) : (
                    <div className="admin-project-documents">
                      {project.documents.map((document) => (
                        <article
                          key={document.id}
                          className="admin-project-document"
                        >
                          <div>
                            <h3>{document.title}</h3>
                            <p>
                              {document.mimeType || 'Тип файла не указан'} ·{' '}
                              {formatDate(document.createdAt)}
                            </p>
                          </div>

                          <a
                            href={getFileUrl(document.fileUrl)}
                            target="_blank"
                            rel="noreferrer"
                            className="button button--outline"
                          >
                            Открыть
                          </a>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <ProjectTasksPanel
                title="Задачи проекта"
                tasks={tasks}
                isLoading={isTasksLoading}
                error={tasksError}
                mode="ADMIN"
                taskTitle={taskTitle}
                taskDescription={taskDescription}
                taskPriority={taskPriority}
                isCreating={isTaskCreating}
                activeTaskId={activeTaskId}
                onTaskTitleChange={setTaskTitle}
                onTaskDescriptionChange={setTaskDescription}
                onTaskPriorityChange={setTaskPriority}
                onCreateTask={handleCreateTask}
                onStatusChange={handleTaskStatusChange}
              />

              {project.contactRequest ? (
                <div className="admin-project-details-card">
                  <h2>Исходная заявка</h2>

                  <div className="admin-project-request-info">
                    <div>
                      <span>Имя</span>
                      <strong>{project.contactRequest.name}</strong>
                    </div>

                    <div>
                      <span>Email</span>
                      <strong>{project.contactRequest.email}</strong>
                    </div>

                    <div>
                      <span>Телефон</span>
                      <strong>{project.contactRequest.phone}</strong>
                    </div>

                    <div>
                      <span>Сообщение</span>
                      <p>{project.contactRequest.message}</p>
                    </div>
                  </div>
                </div>
              ) : null}

              <ProjectMessagesPanel
                title="Переписка по проекту"
                messages={messages}
                messageText={messageText}
                isLoading={isMessagesLoading}
                isSubmitting={isMessageSubmitting}
                error={messagesError}
                currentSide="ADMIN"
                onMessageTextChange={setMessageText}
                onSubmit={handleSendMessage}
              />
            </div>
          ) : null}
        </Container>
      </section>
    </div>
  );
};