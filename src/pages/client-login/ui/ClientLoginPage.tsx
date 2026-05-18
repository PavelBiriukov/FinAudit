import { FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container } from '../../../shared/ui/container/Container';
import { Button } from '../../../shared/ui/button/Button';
import { Input } from '../../../shared/ui/input/Input';
import { loginClient } from '../../../shared/api/clientAuth';
import { ApiError } from '../../../shared/api/base';
import { clientAuthTokenStorage } from '../../../shared/lib/clientAuthTokenStorage';
import './ClientLoginPage.css';

type LocationState = {
  from?: string;
};

export const ClientLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | null;
  const redirectTo = state?.from || '/client/dashboard';

  const [email, setEmail] = useState('client@auditpro.local');
  const [password, setPassword] = useState('Client123456!');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await loginClient({
        email,
        password,
      });

      clientAuthTokenStorage.setToken(response.token);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Не удалось выполнить вход');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="client-login-page">
      <section className="section">
        <Container>
          <div className="client-login-card">
            <h1>Вход в кабинет клиента</h1>
            <p>Только для клиентов компании.</p>

            <form className="client-login-form" onSubmit={handleSubmit}>
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                disabled={isSubmitting}
              />

              <Input
                label="Пароль"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                disabled={isSubmitting}
              />

              {error ? <p className="client-login-error">{error}</p> : null}

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Вход...' : 'Войти'}
              </Button>
            </form>
          </div>
        </Container>
      </section>
    </div>
  );
};