import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../../../shared/ui/container/Container';
import { SectionTitle } from '../../../shared/ui/section-title/SectionTitle';
import { Button } from '../../../shared/ui/button/Button';
import { Input } from '../../../shared/ui/input/Input';
import { Link } from 'react-router-dom';
import {
  CONTACT_REQUEST_STATUS_FILTER_OPTIONS,
  CONTACT_REQUEST_STATUS_LABELS,
  CONTACT_REQUEST_STATUS_OPTIONS,
  type ContactRequestStatusFilter,
} from '../../../shared/config/contactRequestStatuses';
import {
  changeContactRequestStatus,
  getContactRequests,
} from '../../../shared/api/contactRequests';
import { ApiError } from '../../../shared/api/base';
import { adminAuthTokenStorage } from '../../../shared/lib/adminAuthTokenStorage';
import type {
  ContactRequest,
  ContactRequestListMeta,
  ContactRequestStatus,
} from '../../../shared/types/contactRequest';
import './AdminRequestsPage.css';

const PAGE_SIZE = 10;

const formatDate = (value: string) => {
  return new Date(value).toLocaleString('ru-RU', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};

const getVisiblePages = (page: number, pageCount: number) => {
  const start = Math.max(1, page - 2);
  const end = Math.min(pageCount, page + 2);

  const pages: number[] = [];

  for (let current = start; current <= end; current += 1) {
    pages.push(current);
  }

  return pages;
};

export const AdminRequestsPage = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [filter, setFilter] = useState<ContactRequestStatusFilter>('ALL');
  const [searchInput, setSearchInput] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [page, setPage] = useState(1);

  const [meta, setMeta] = useState<ContactRequestListMeta>({
    total: 0,
    page: 1,
    pageSize: PAGE_SIZE,
    pageCount: 1,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const visiblePages = useMemo(
    () => getVisiblePages(meta.page, meta.pageCount),
    [meta.page, meta.pageCount],
  );

  const handleUnauthorized = () => {
    adminAuthTokenStorage.clearToken();
    navigate('/admin/login', { replace: true });
  };

  const loadRequests = async ({
    currentFilter,
    currentSearch,
    currentPage,
  }: {
    currentFilter: ContactRequestStatusFilter;
    currentSearch: string;
    currentPage: number;
  }) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await getContactRequests({
        status: currentFilter === 'ALL' ? undefined : currentFilter,
        search: currentSearch,
        page: currentPage,
        pageSize: PAGE_SIZE,
      });

      setRequests(response.data);
      setMeta(response.meta);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        handleUnauthorized();
        return;
      }

      setError(
        err instanceof Error
          ? err.message
          : 'Не удалось загрузить список заявок',
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadRequests({
      currentFilter: filter,
      currentSearch: appliedSearch,
      currentPage: page,
    });
  }, [filter, appliedSearch, page]);

  const handleStatusChange = async (
    requestId: string,
    status: ContactRequestStatus,
  ) => {
    setActiveRequestId(requestId);
    setError('');
    setSuccessMessage('');

    try {
      const response = await changeContactRequestStatus(requestId, status);

      setSuccessMessage(response.message || 'Статус обновлён');

      await loadRequests({
        currentFilter: filter,
        currentSearch: appliedSearch,
        currentPage: page,
      });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        handleUnauthorized();
        return;
      }

      setError(
        err instanceof Error
          ? err.message
          : 'Не удалось обновить статус заявки',
      );
    } finally {
      setActiveRequestId(null);
    }
  };

  const handleLogout = () => {
    adminAuthTokenStorage.clearToken();
    navigate('/admin/login', { replace: true });
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage('');
    setError('');
    setPage(1);
    setAppliedSearch(searchInput.trim());
  };

  const handleResetSearch = () => {
    setSearchInput('');
    setAppliedSearch('');
    setPage(1);
    setSuccessMessage('');
    setError('');
  };

  return (
    <div className="admin-requests-page">
      <section className="inner-hero">
        <Container>
          <SectionTitle
            eyebrow="Админка"
            title="Заявки клиентов"
            description="Теперь здесь есть не только статусы, но и нормальный поиск с пагинацией."
          />
        </Container>
      </section>

      <section className="section">
        <Container>
          <div className="admin-requests-toolbar">
            <form
              className="admin-requests-search"
              onSubmit={handleSearchSubmit}
            >
              <Input
                label="Поиск по имени или email"
                placeholder="Например: павел или test@example.com"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
              />

              <div className="admin-requests-search-actions">
                <Button type="submit">Найти</Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetSearch}
                >
                  Сбросить
                </Button>
              </div>
            </form>

            <div className="admin-requests-toolbar-right">
              <label className="admin-requests-filter">
                <span>Фильтр по статусу</span>

                <select
                  value={filter}
                  onChange={(event) => {
                    setFilter(
                      event.target.value as ContactRequestStatusFilter,
                    );
                    setPage(1);
                  }}
                >
                  {CONTACT_REQUEST_STATUS_FILTER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <Button variant="outline" onClick={handleLogout}>
                Выйти
              </Button>
            </div>
          </div>

          <div className="admin-requests-summary">
            <span>Всего найдено: {meta.total}</span>
            <span>
              Страница {meta.page} из {meta.pageCount}
            </span>
          </div>

          {successMessage ? (
            <p className="admin-requests-feedback admin-requests-feedback--success">
              {successMessage}
            </p>
          ) : null}

          {error ? (
            <p className="admin-requests-feedback admin-requests-feedback--error">
              {error}
            </p>
          ) : null}

          {isLoading ? (
            <div className="admin-requests-empty">Загрузка заявок...</div>
          ) : requests.length === 0 ? (
            <div className="admin-requests-empty">Ничего не найдено</div>
          ) : (
            <div className="admin-requests-table-wrapper">
              <table className="admin-requests-table">
                <thead>
                  <tr>
                    <th>Имя</th>
                    <th>Контакты</th>
                    <th>Сообщение</th>
                    <th>Дата</th>
                    <th>Статус</th>
                    <th>Действие</th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td>{request.name}</td>

                      <td>
                        <div className="admin-requests-contact">
                          <a href={`mailto:${request.email}`}>{request.email}</a>
                          <a href={`tel:${request.phone}`}>{request.phone}</a>
                        </div>
                      </td>

                      <td>
                        <div className="admin-requests-message">
                          {request.message}
                        </div>
                      </td>

                      <td>{formatDate(request.createdAt)}</td>

                      <td>
                        <span
                          className={`status-badge status-badge--${request.status.toLowerCase()}`}
                        >
                          {CONTACT_REQUEST_STATUS_LABELS[request.status]}
                        </span>
                      </td>

                      <td>
                        <div className="admin-requests-actions">
                          <Link
                            to={`/admin/requests/${request.id}`}
                            className="button button--outline"
                          >
                            Открыть
                          </Link>
                                        
                          <select
                            className="admin-requests-status-select"
                            value={request.status}
                            disabled={activeRequestId === request.id}
                            onChange={(event) =>
                              handleStatusChange(
                                request.id,
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="admin-requests-pagination">
            <Button
              variant="outline"
              disabled={!meta.hasPreviousPage || isLoading}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Назад
            </Button>

            <div className="admin-requests-pages">
              {visiblePages.map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  className={`admin-requests-page-button ${
                    pageNumber === meta.page
                      ? 'admin-requests-page-button--active'
                      : ''
                  }`}
                  onClick={() => setPage(pageNumber)}
                  disabled={isLoading}
                >
                  {pageNumber}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              disabled={!meta.hasNextPage || isLoading}
              onClick={() =>
                setPage((prev) => Math.min(meta.pageCount, prev + 1))
              }
            >
              Вперёд
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
};