import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Container } from '../../../shared/ui/container/Container';
import { SectionTitle } from '../../../shared/ui/section-title/SectionTitle';
import { Button } from '../../../shared/ui/button/Button';
import { Textarea } from '../../../shared/ui/textarea/Textarea';
import { ApiError } from '../../../shared/api/base';
import {
  changeContactRequestStatus,
  convertContactRequestToProject,
  createAdminComment,
  getContactRequestById,
} from '../../../shared/api/contactRequests';
import {
  createAdminProjectMessage,
  getAdminProjectMessages,
} from '../../../shared/api/adminProjectMessages';
import { ProjectMessagesPanel } from '../../../features/project-messages';
import { adminAuthTokenStorage } from '../../../shared/lib/adminAuthTokenStorage';
import {
  CONTACT_REQUEST_STATUS_LABELS,
  CONTACT_REQUEST_STATUS_OPTIONS,
} from '../../../shared/config/contactRequestStatuses';
import type {
  ContactRequestDetails,
  ContactRequestStatus,
} from '../../../shared/types/contactRequest';
import type { ProjectMessage } from '../../../shared/types/projectMessage';
import './AdminRequestDetailsPage.css';

const formatDate = (value: string) =>
  new Date(value).toLocaleString('ru-RU', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

export const AdminRequestDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [requestItem, setRequestItem] = useState<ContactRequestDetails | null>(
    null,
  );
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const [isStatusSubmitting, setIsStatusSubmitting] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [conversionInfo, setConversionInfo] = useState<{
    createdNewClient: boolean;
    temporaryPassword: string | null;
    clientEmail: string;
    projectTitle: string;
  } | null>(null);

  const [projectMessages, setProjectMessages] = useState<ProjectMessage[]>([]);
  const [projectMessageText, setProjectMessageText] = useState('');
  const [isProjectMessagesLoading, setIsProjectMessagesLoading] =
    useState(false);
  const [isProjectMessageSubmitting, setIsProjectMessageSubmitting] =
    useState(false);
  const [projectMessagesError, setProjectMessagesError] = useState('');

  const handleUnauthorized = () => {
    adminAuthTokenStorage.clearToken();
    navigate('/admin/login', { replace: true });
  };

  const loadRequest = async () => {
    if (!id) {
      setError('Не передан id заявки');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await getContactRequestById(id);
      setRequestItem(response.data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        handleUnauthorized();
        return;
      }

      setError(
        err instanceof Error ? err.message : 'Не удалось загрузить заявку',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadProjectMessages = async (projectId: string) => {
    setIsProjectMessagesLoading(true);
    setProjectMessagesError('');

    try {
      const response = await getAdminProjectMessages(projectId);
      setProjectMessages(response.data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        handleUnauthorized();
        return;
      }

      setProjectMessagesError(
        err instanceof Error ? err.message : 'Не удалось загрузить сообщения',
      );
    } finally {
      setIsProjectMessagesLoading(false);
    }
  };

  useEffect(() => {
    void loadRequest();
  }, [id]);

  useEffect(() => {
    if (!requestItem?.project?.id) {
      setProjectMessages([]);
      setProjectMessagesError('');
      setProjectMessageText('');
      return;
    }

    void loadProjectMessages(requestItem.project.id);
  }, [requestItem?.project?.id]);

  const handleStatusChange = async (status: ContactRequestStatus) => {
    if (!id) {
      return;
    }

    setIsStatusSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await changeContactRequestStatus(id, status);

      setSuccessMessage(response.message || 'Статус обновлён');
      await loadRequest();
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

  const handleCommentSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id || !commentText.trim()) {
      return;
    }

    setIsCommentSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await createAdminComment(id, commentText.trim());

      setSuccessMessage(response.message || 'Комментарий добавлен');
      setCommentText('');
      await loadRequest();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        handleUnauthorized();
        return;
      }

      setError(
        err instanceof Error ? err.message : 'Не удалось добавить комментарий',
      );
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  const handleConvertToProject = async () => {
    if (!id) {
      return;
    }

    setIsConverting(true);
    setError('');
    setSuccessMessage('');
    setConversionInfo(null);

    try {
      const response = await convertContactRequestToProject(id);

      setSuccessMessage(response.message || 'Клиент и проект созданы');
      setConversionInfo({
        createdNewClient: response.data.createdNewClient,
        temporaryPassword: response.data.temporaryPassword,
        clientEmail: response.data.client.email,
        projectTitle: response.data.project.title,
      });

      await loadRequest();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        handleUnauthorized();
        return;
      }

      setError(
        err instanceof Error
          ? err.message
          : 'Не удалось создать клиента и проект',
      );
    } finally {
      setIsConverting(false);
    }
  };

  const handleSendProjectMessage = async () => {
    if (!requestItem?.project?.id || !projectMessageText.trim()) {
      return;
    }

    setIsProjectMessageSubmitting(true);
    setProjectMessagesError('');

    try {
      await createAdminProjectMessage(
        requestItem.project.id,
        projectMessageText.trim(),
      );

      setProjectMessageText('');
      await loadProjectMessages(requestItem.project.id);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        handleUnauthorized();
        return;
      }

      setProjectMessagesError(
        err instanceof Error ? err.message : 'Не удалось отправить сообщение',
      );
    } finally {
      setIsProjectMessageSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-request-details-page">
        <section className="section">
          <Container>
            <div className="admin-request-details-empty">
              Загрузка заявки...
            </div>
          </Container>
        </section>
      </div>
    );
  }

  if (!requestItem) {
    return (
      <div className="admin-request-details-page">
        <section className="section">
          <Container>
            <div className="admin-request-details-empty">
              Заявка не найдена
            </div>
          </Container>
        </section>
      </div>
    );
  }

  return (
    <div className="admin-request-details-page">
      <section className="inner-hero">
        <Container>
          <div className="admin-request-details-header">
            <div>
              <SectionTitle
                eyebrow="Карточка заявки"
                title={requestItem.name}
                description="Здесь уже начинается нормальная внутренняя работа, а не просто список."
              />
            </div>

            <Link to="/admin/requests" className="button button--outline">
              Назад к списку
            </Link>
          </div>
        </Container>
      </section>

      <section className="section">
        <Container>
          {successMessage ? (
            <p className="admin-request-details-feedback admin-request-details-feedback--success">
              {successMessage}
            </p>
          ) : null}

          {error ? (
            <p className="admin-request-details-feedback admin-request-details-feedback--error">
              {error}
            </p>
          ) : null}

          <div className="admin-request-details-grid">
            <div className="admin-request-card">
              <h2>Информация по заявке</h2>

              <div className="admin-request-card__rows">
                <div>
                  <span>Имя</span>
                  <strong>{requestItem.name}</strong>
                </div>

                <div>
                  <span>Email</span>
                  <a href={`mailto:${requestItem.email}`}>
                    {requestItem.email}
                  </a>
                </div>

                <div>
                  <span>Телефон</span>
                  <a href={`tel:${requestItem.phone}`}>
                    {requestItem.phone}
                  </a>
                </div>

                <div>
                  <span>Создана</span>
                  <strong>{formatDate(requestItem.createdAt)}</strong>
                </div>

                <div>
                  <span>Статус</span>
                  <span
                    className={`status-badge status-badge--${requestItem.status.toLowerCase()}`}
                  >
                    {CONTACT_REQUEST_STATUS_LABELS[requestItem.status]}
                  </span>
                </div>

                {requestItem.client ? (
                  <div>
                    <span>Клиент</span>
                    <strong>
                      {requestItem.client.fullName} ({requestItem.client.email})
                    </strong>
                  </div>
                ) : null}

                {requestItem.project ? (
                  <div>
                    <span>Проект</span>
                    <strong>{requestItem.project.title}</strong>
                  </div>
                ) : null}
              </div>

              <div className="admin-request-card__message">
                <span>Сообщение клиента</span>
                <p>{requestItem.message}</p>
              </div>

              <div className="admin-request-card__actions">
                <label className="admin-request-card__status-control">
                  <span>Изменить статус</span>

                  <select
                    value={requestItem.status}
                    disabled={isStatusSubmitting}
                    onChange={(event) =>
                      handleStatusChange(
                        event.target.value as ContactRequestStatus,
                      )
                    }
                  >
                    {CONTACT_REQUEST_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="admin-request-conversion-card">
                <h2>Конвертация заявки</h2>

                {requestItem.project ? (
                  <div className="admin-request-conversion-card__done">
                    <p>
                      Проект уже создан:{' '}
                      <strong>{requestItem.project.title}</strong>
                    </p>
                                
                    {requestItem.client ? (
                      <p>
                        Клиент:{' '}
                        <strong>{requestItem.client.fullName}</strong> (
                        {requestItem.client.email})
                      </p>
                    ) : null}
                
                    <Link
                      to={`/admin/projects/${requestItem.project.id}`}
                      className="button button--primary"
                    >
                      Открыть проект
                    </Link>
                  </div>
                ) : (
                  <div className="admin-request-conversion-card__pending">
                    <p>
                      Эта заявка ещё не конвертирована в клиента и проект.
                    </p>

                    <Button
                      type="button"
                      onClick={handleConvertToProject}
                      disabled={isConverting}
                    >
                      {isConverting
                        ? 'Создание...'
                        : 'Создать клиента и проект'}
                    </Button>
                  </div>
                )}

                {conversionInfo ? (
                  <div className="admin-request-conversion-result">
                    <p>
                      Создан проект{' '}
                      <strong>{conversionInfo.projectTitle}</strong> для
                      клиента <strong>{conversionInfo.clientEmail}</strong>.
                    </p>

                    {conversionInfo.createdNewClient &&
                    conversionInfo.temporaryPassword ? (
                      <p>
                        Временный пароль клиента:{' '}
                        <strong>{conversionInfo.temporaryPassword}</strong>
                      </p>
                    ) : (
                      <p>Использован уже существующий клиент.</p>
                    )}
                  </div>
                ) : null}
              </div>

              {requestItem.project ? (
                <ProjectMessagesPanel
                  title="Переписка по проекту"
                  messages={projectMessages}
                  messageText={projectMessageText}
                  isLoading={isProjectMessagesLoading}
                  isSubmitting={isProjectMessageSubmitting}
                  error={projectMessagesError}
                  currentSide="ADMIN"
                  onMessageTextChange={setProjectMessageText}
                  onSubmit={handleSendProjectMessage}
                />
              ) : null}
            </div>

            <div className="admin-comments-card">
              <h2>Комментарии менеджера</h2>

              <form
                className="admin-comments-form"
                onSubmit={handleCommentSubmit}
              >
                <Textarea
                  label="Новый комментарий"
                  placeholder="Например: созвонился, запросил документы, ждём ответ клиента..."
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  disabled={isCommentSubmitting}
                />

                <Button
                  type="submit"
                  disabled={isCommentSubmitting || !commentText.trim()}
                >
                  {isCommentSubmitting
                    ? 'Сохранение...'
                    : 'Добавить комментарий'}
                </Button>
              </form>

              <div className="admin-comments-list">
                {requestItem.comments.length === 0 ? (
                  <div className="admin-request-details-empty">
                    Комментариев пока нет
                  </div>
                ) : (
                  requestItem.comments.map((comment) => (
                    <article key={comment.id} className="admin-comment-item">
                      <div className="admin-comment-item__meta">
                        <strong>{comment.author.email}</strong>
                        <span>{formatDate(comment.createdAt)}</span>
                      </div>

                      <p>{comment.text}</p>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};