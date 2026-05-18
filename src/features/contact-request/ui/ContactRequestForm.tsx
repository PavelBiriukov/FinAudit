import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../../shared/ui/button/Button';
import { Input } from '../../../shared/ui/input/Input';
import { Textarea } from '../../../shared/ui/textarea/Textarea';
import {
  contactRequestSchema,
  ContactRequestFormValues,
} from '../model/contactRequestSchema';
import { sendContactRequest } from '../api/sendContactRequest';
import './ContactRequestForm.css';

const defaultValues: ContactRequestFormValues = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

export const ContactRequestForm = () => {
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactRequestFormValues>({
    resolver: zodResolver(contactRequestSchema),
    defaultValues,
    mode: 'onTouched',
  });

  const clearSubmitState = () => {
    if (submitSuccess) {
      setSubmitSuccess('');
    }

    if (submitError) {
      setSubmitError('');
    }
  };

  const onSubmit = async (values: ContactRequestFormValues) => {
    setSubmitSuccess('');
    setSubmitError('');

    try {
      const response = await sendContactRequest(values);

      setSubmitSuccess(
        response.message || 'Заявка успешно отправлена. Я скоро свяжусь с вами.',
      );
      reset(defaultValues);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Не удалось отправить заявку. Попробуйте позже.',
      );
    }
  };

  return (
    <form
      id="contact-form"
      className="contact-form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      onChangeCapture={clearSubmitState}
    >
      <div className="contact-form__grid">
        <Input
          label="Имя"
          placeholder="Введите имя"
          autoComplete="name"
          disabled={isSubmitting}
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email"
          type="email"
          placeholder="Введите email"
          autoComplete="email"
          disabled={isSubmitting}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Телефон"
          type="tel"
          placeholder="Введите номер телефона"
          autoComplete="tel"
          disabled={isSubmitting}
          error={errors.phone?.message}
          {...register('phone')}
        />

        <div className="contact-form__message">
          <Textarea
            label="Сообщение"
            placeholder="Опишите ваш запрос"
            disabled={isSubmitting}
            error={errors.message?.message}
            {...register('message')}
          />
        </div>
      </div>

      <div className="contact-form__actions">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
        </Button>

        <p className="contact-form__hint">
          После отправки данные уйдут на API `POST /contact-requests`.
        </p>
      </div>

      {submitSuccess ? (
        <p
          className="contact-form__feedback contact-form__feedback--success"
          aria-live="polite"
        >
          {submitSuccess}
        </p>
      ) : null}

      {submitError ? (
        <p
          className="contact-form__feedback contact-form__feedback--error"
          aria-live="polite"
        >
          {submitError}
        </p>
      ) : null}
    </form>
  );
};