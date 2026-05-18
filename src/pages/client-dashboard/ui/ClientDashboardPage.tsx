import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from '../../../shared/ui/container/Container';
import { SectionTitle } from '../../../shared/ui/section-title/SectionTitle';
import { Button } from '../../../shared/ui/button/Button';
import { getClientMe } from '../../../shared/api/clientAuth';
import { ApiError } from '../../../shared/api/base';
import { clientAuthTokenStorage } from '../../../shared/lib/clientAuthTokenStorage';
import type { ClientUser } from '../../../shared/types/clientAuth';

export const ClientDashboardPage = () => {
  const navigate = useNavigate();
  const [client, setClient] = useState<ClientUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const handleUnauthorized = () => {
    clientAuthTokenStorage.clearToken();
    navigate('/client/login', { replace: true });
  };

  useEffect(() => {
    const loadMe = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await getClientMe();
        setClient(response.client);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          handleUnauthorized();
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : 'Не удалось загрузить кабинет клиента',
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadMe();
  }, []);

  const handleLogout = () => {
    clientAuthTokenStorage.clearToken();
    navigate('/client/login', { replace: true });
  };

  return (
    <div className="client-dashboard-page">
      <section className="section">
        <Container>
          <SectionTitle
            eyebrow="Кабинет клиента"
            title="Личный кабинет"
            description="Теперь отсюда уже можно идти в список проектов."
          />

          {isLoading ? <p>Загрузка...</p> : null}
          {error ? <p>{error}</p> : null}

          {client ? (
            <div style={{ display: 'grid', gap: '12px' }}>
              <div>
                <strong>Имя:</strong> {client.fullName}
              </div>
              <div>
                <strong>Email:</strong> {client.email}
              </div>
              <div>
                <strong>Роль:</strong> {client.role}
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link to="/client/projects" className="button button--primary">
                  Мои проекты
                </Link>

                <Button variant="outline" onClick={handleLogout}>
                  Выйти
                </Button>
              </div>
            </div>
          ) : null}
        </Container>
      </section>
    </div>
  );
};