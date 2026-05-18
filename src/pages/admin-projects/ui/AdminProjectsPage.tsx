import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from '../../../shared/ui/container/Container';
import { SectionTitle } from '../../../shared/ui/section-title/SectionTitle';
import { Button } from '../../../shared/ui/button/Button';
import { getAdminProjects } from '../../../shared/api/adminProjects';
import { ApiError } from '../../../shared/api/base';
import { adminAuthTokenStorage } from '../../../shared/lib/adminAuthTokenStorage';
import { PROJECT_STATUS_LABELS } from '../../../shared/config/projectStatuses';
import type { ProjectListItem } from '../../../shared/types/project';
import './AdminProjectsPage.css';

const formatDate = (value: string) =>
  new Date(value).toLocaleString('ru-RU', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

export const AdminProjectsPage = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const handleUnauthorized = () => {
    adminAuthTokenStorage.clearToken();
    navigate('/admin/login', { replace: true });
  };

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await getAdminProjects();
        setProjects(response.data);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          handleUnauthorized();
          return;
        }

        setError(
          err instanceof Error ? err.message : 'Не удалось загрузить проекты',
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadProjects();
  }, []);

  return (
    <div className="admin-projects-page">
      <section className="section">
        <Container>
          <div className="admin-projects-header">
            <SectionTitle
              eyebrow="CRM"
              title="Проекты"
              description="Теперь проект живёт отдельно от заявки. Это уже нормальная CRM-логика."
            />

            <div className="admin-projects-header__actions">
              <Link to="/admin/requests" className="button button--outline">
                Заявки
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="admin-projects-empty">Загрузка проектов...</div>
          ) : null}

          {error ? <div className="admin-projects-error">{error}</div> : null}

          {!isLoading && !error && projects.length === 0 ? (
            <div className="admin-projects-empty">Проектов пока нет</div>
          ) : null}

          {!isLoading && !error && projects.length > 0 ? (
            <div className="admin-projects-grid">
              {projects.map((project) => (
                <article key={project.id} className="admin-project-card">
                  <div className="admin-project-card__top">
                    <h2>{project.title}</h2>

                    <span
                      className={`status-badge status-badge--${project.status.toLowerCase()}`}
                    >
                      {PROJECT_STATUS_LABELS[project.status]}
                    </span>
                  </div>

                  <p className="admin-project-card__description">
                    {project.description || 'Описание проекта пока не заполнено'}
                  </p>

                  <div className="admin-project-card__meta">
                    <div>
                      <span>Клиент</span>
                      <strong>
                        {project.client?.fullName || 'Клиент не указан'}
                      </strong>
                      <small>{project.client?.email}</small>
                    </div>

                    <div>
                      <span>Менеджер</span>
                      <strong>
                        {project.manager?.email || 'Пока не назначен'}
                      </strong>
                    </div>

                    <div>
                      <span>Документы</span>
                      <strong>{project.documentsCount}</strong>
                    </div>

                    <div>
                      <span>Сообщения</span>
                      <strong>{project.messagesCount ?? 0}</strong>
                    </div>

                    <div>
                      <span>Создан</span>
                      <strong>{formatDate(project.createdAt)}</strong>
                    </div>
                  </div>

                  <Link
                    to={`/admin/projects/${project.id}`}
                    className="button button--primary"
                  >
                    Открыть проект
                  </Link>
                </article>
              ))}
            </div>
          ) : null}
        </Container>
      </section>
    </div>
  );
};