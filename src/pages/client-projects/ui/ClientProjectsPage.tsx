import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from '../../../shared/ui/container/Container';
import { SectionTitle } from '../../../shared/ui/section-title/SectionTitle';
import { Button } from '../../../shared/ui/button/Button';
import { getClientProjects } from '../../../shared/api/clientProjects';
import { ApiError } from '../../../shared/api/base';
import { clientAuthTokenStorage } from '../../../shared/lib/clientAuthTokenStorage';
import { PROJECT_STATUS_LABELS } from '../../../shared/config/projectStatuses';
import type { ProjectListItem } from '../../../shared/types/project';
import './ClientProjectsPage.css';

const formatDate = (value: string) =>
  new Date(value).toLocaleString('ru-RU', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

export const ClientProjectsPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const handleUnauthorized = () => {
    clientAuthTokenStorage.clearToken();
    navigate('/client/login', { replace: true });
  };

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await getClientProjects();
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

  const handleLogout = () => {
    clientAuthTokenStorage.clearToken();
    navigate('/client/login', { replace: true });
  };

  return (
    <div className="client-projects-page">
      <section className="section">
        <Container>
          <div className="client-projects-header">
            <SectionTitle
              eyebrow="Кабинет клиента"
              title="Мои проекты"
              description="Это уже первый реальный экран кабинета: клиент видит только свои проекты."
            />

            <div className="client-projects-header__actions">
              <Link to="/client/dashboard" className="button button--outline">
                В кабинет
              </Link>

              <Button variant="outline" onClick={handleLogout}>
                Выйти
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="client-projects-empty">Загрузка проектов...</div>
          ) : null}

          {error ? <div className="client-projects-error">{error}</div> : null}

          {!isLoading && !error && projects.length === 0 ? (
            <div className="client-projects-empty">
              Пока нет проектов, привязанных к этому клиенту
            </div>
          ) : null}

          {!isLoading && !error && projects.length > 0 ? (
            <div className="client-projects-grid">
              {projects.map((project) => (
                <article key={project.id} className="client-project-card">
                  <div className="client-project-card__top">
                    <h2>{project.title}</h2>
                    <span
                      className={`status-badge status-badge--${project.status.toLowerCase()}`}
                    >
                      {PROJECT_STATUS_LABELS[project.status]}
                    </span>
                  </div>

                  <p className="client-project-card__description">
                    {project.description || 'Описание проекта пока не заполнено'}
                  </p>

                  <div className="client-project-card__meta">
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
                      <span>Создан</span>
                      <strong>{formatDate(project.createdAt)}</strong>
                    </div>
                  </div>

                  <Link
                    to={`/client/projects/${project.id}`}
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