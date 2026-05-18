import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Container } from '../../../shared/ui/container/Container';
import { SectionTitle } from '../../../shared/ui/section-title/SectionTitle';
import { getClientProjectById } from '../../../shared/api/clientProjects';
import {
  createClientProjectMessage,
  getClientProjectMessages,
} from '../../../shared/api/clientProjectMessages';
import { getClientProjectTasks } from '../../../shared/api/clientProjectTasks';
import { ApiError } from '../../../shared/api/base';
import { clientAuthTokenStorage } from '../../../shared/lib/clientAuthTokenStorage';
import { getFileUrl } from '../../../shared/lib/getFileUrl';
import { PROJECT_STATUS_LABELS } from '../../../shared/config/projectStatuses';
import { ProjectMessagesPanel } from '../../../features/project-messages';
import { ProjectTasksPanel } from '../../../features/project-tasks';
import type { ProjectDetails } from '../../../shared/types/project';
import type { ProjectMessage } from '../../../shared/types/projectMessage';
import type { ProjectTask } from '../../../shared/types/projectTask';
import './ClientProjectDetailsPage.css';

const formatDate = (value: string) =>
  new Date(value).toLocaleString('ru-RU', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

export const ClientProjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
  const [messageText, setMessageText] = useState('');

  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [isTasksLoading, setIsTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [isMessageSubmitting, setIsMessageSubmitting] = useState(false);

  const [error, setError] = useState('');
  const [messagesError, setMessagesError] = useState('');

  const handleUnauthorized = () => {
    clientAuthTokenStorage.clearToken();
    navigate('/client/login', { replace: true });
  };

  const loadMessages = async (projectId: string) => {
    setIsMessagesLoading(true);
    setMessagesError('');

    try {
      const response = await getClientProjectMessages(projectId);
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
      const response = await getClientProjectTasks(projectId);
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

  useEffect(() => {
    const loadProject = async () => {
      if (!id) {
        setError('Не передан id проекта');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        const response = await getClientProjectById(id);
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

    void loadProject();
  }, [id]);

  const handleSendMessage = async () => {
    if (!id || !messageText.trim()) {
      return;
    }

    setIsMessageSubmitting(true);
    setMessagesError('');

    try {
      await createClientProjectMessage(id, messageText.trim());
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

  return (
    <div className="client-project-details-page">
      <section className="section">
        <Container>
          <div className="client-project-details-header">
            <SectionTitle
              eyebrow="Кабинет клиента"
              title={project?.title || 'Проект'}
              description="Здесь клиент видит проект, документы, задачи и переписку с менеджером."
            />

            <div className="client-project-details-header__actions">
              <Link to="/client/projects" className="button button--outline">
                Назад к проектам
              </Link>

              <Link to="/client/dashboard" className="button button--outline">
                В кабинет
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="client-project-details-empty">
              Загрузка проекта...
            </div>
          ) : null}

          {error ? (
            <div className="client-project-details-error">{error}</div>
          ) : null}

          {!isLoading && !error && project ? (
            <div className="client-project-details-layout">
              <div className="client-project-details-grid">
                <div className="client-project-details-card">
                  <h2>Информация о проекте</h2>

                  <div className="client-project-details-meta">
                    <div>
                      <span>Статус</span>
                      <strong
                        className={`status-badge status-badge--${project.status.toLowerCase()}`}
                      >
                        {PROJECT_STATUS_LABELS[project.status]}
                      </strong>
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

                  <div className="client-project-details-description">
                    <span>Описание</span>
                    <p>
                      {project.description ||
                        'Описание проекта пока не заполнено'}
                    </p>
                  </div>
                </div>

                <div className="client-project-details-card">
                  <h2>Документы проекта</h2>

                  {project.documents.length === 0 ? (
                    <div className="client-project-details-empty">
                      Документы пока не добавлены
                    </div>
                  ) : (
                    <div className="client-project-documents">
                      {project.documents.map((document) => (
                        <article
                          key={document.id}
                          className="client-project-document"
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
                mode="CLIENT"
              />

              <ProjectMessagesPanel
                messages={messages}
                messageText={messageText}
                isLoading={isMessagesLoading}
                isSubmitting={isMessageSubmitting}
                error={messagesError}
                currentSide="CLIENT"
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