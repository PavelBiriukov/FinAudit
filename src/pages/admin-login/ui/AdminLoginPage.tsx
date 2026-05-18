import { FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container } from '../../../shared/ui/container/Container';
import { Button } from '../../../shared/ui/button/Button';
import { Input } from '../../../shared/ui/input/Input';
import { loginAdmin } from '../../../shared/api/adminAuth';
import { ApiError } from '../../../shared/api/base';
import { adminAuthTokenStorage } from '../../../shared/lib/adminAuthTokenStorage';
import './AdminLoginPage.css';

type LocationState = {
  from?: string;
};

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | null;
  const redirectTo = state?.from || '/admin/requests';

  const [email, setEmail] = useState('admin@auditpro.local');
  const [password, setPassword] = useState('Admin123456!');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await loginAdmin({
        email,
        password,
      });

      adminAuthTokenStorage.setToken(response.token);
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
    <div className="admin-login-page">
      <section className="section">
        <Container>
          <div className="admin-login-card">
            <h1>Вход в админку</h1>
            <p>Только для администратора заявок.</p>

            <form className="admin-login-form" onSubmit={handleSubmit}>
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

              {error ? <p className="admin-login-error">{error}</p> : null}

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