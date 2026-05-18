import { FormEvent } from 'react';
import { Button } from '../../../shared/ui/button/Button';
import { Textarea } from '../../../shared/ui/textarea/Textarea';
import type { ProjectMessage } from '../../../shared/types/projectMessage';
import './ProjectMessagesPanel.css';

type ProjectMessagesPanelProps = {
  title?: string;
  messages: ProjectMessage[];
  messageText: string;
  isLoading: boolean;
  isSubmitting: boolean;
  error?: string;
  currentSide: 'ADMIN' | 'CLIENT';
  onMessageTextChange: (value: string) => void;
  onSubmit: () => Promise<void> | void;
};

const formatDate = (value: string) =>
  new Date(value).toLocaleString('ru-RU', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

const getAuthorLabel = (message: ProjectMessage) => {
  if (message.authorType === 'ADMIN') {
    return message.authorAdmin?.email || 'Менеджер';
  }

  return message.authorClient?.fullName || message.authorClient?.email || 'Клиент';
};

export const ProjectMessagesPanel = ({
  title = 'Сообщения по проекту',
  messages,
  messageText,
  isLoading,
  isSubmitting,
  error,
  currentSide,
  onMessageTextChange,
  onSubmit,
}: ProjectMessagesPanelProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void onSubmit();
  };

  return (
    <div className="project-messages-panel">
      <h2>{title}</h2>

      <form className="project-messages-form" onSubmit={handleSubmit}>
        <Textarea
          label="Новое сообщение"
          placeholder="Напишите сообщение по проекту..."
          value={messageText}
          onChange={(event) => onMessageTextChange(event.target.value)}
          disabled={isSubmitting}
        />

        <Button type="submit" disabled={isSubmitting || !messageText.trim()}>
          {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
        </Button>
      </form>

      {error ? <p className="project-messages-error">{error}</p> : null}

      {isLoading ? (
        <div className="project-messages-empty">Загрузка сообщений...</div>
      ) : null}

      {!isLoading && messages.length === 0 ? (
        <div className="project-messages-empty">
          Сообщений по проекту пока нет
        </div>
      ) : null}

      {!isLoading && messages.length > 0 ? (
        <div className="project-messages-list">
          {messages.map((message) => {
            const isOwn = message.authorType === currentSide;

            return (
              <article
                key={message.id}
                className={`project-message ${
                  isOwn ? 'project-message--own' : ''
                }`}
              >
                <div className="project-message__meta">
                  <strong>{getAuthorLabel(message)}</strong>
                  <span>{formatDate(message.createdAt)}</span>
                </div>

                <p>{message.text}</p>
              </article>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};