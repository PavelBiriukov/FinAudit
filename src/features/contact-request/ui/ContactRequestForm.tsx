import { FormEvent, useMemo, useState } from 'react';
import { Button } from '../../../shared/ui/button/Button';
import { Input } from '../../../shared/ui/input/Input';
import { Textarea } from '../../../shared/ui/textarea/Textarea';
import { ContactRequestFormValues } from '../model/types';
import './ContactRequestForm.css';

type ContactRequestErrors = Partial<Record<keyof ContactRequestFormValues, string>>;

const initialValues: ContactRequestFormValues = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ContactRequestForm = () => {
  const [values, setValues] = useState<ContactRequestFormValues>(initialValues);
  const [errors, setErrors] = useState<ContactRequestErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isFormFilled = useMemo(() => {
    return (
      values.name.trim().length > 0 &&
      values.email.trim().length > 0 &&
      values.phone.trim().length > 0 &&
      values.message.trim().length > 0
    );
  }, [values]);

  const validate = (): ContactRequestErrors => {
    const nextErrors: ContactRequestErrors = {};

    if (!values.name.trim()) {
      nextErrors.name = 'Введите имя';
    } else if (values.name.trim().length < 2) {
      nextErrors.name = 'Имя слишком короткое';
    }

    if (!values.email.trim()) {
      nextErrors.email = 'Введите email';
    } else if (!emailRegex.test(values.email.trim())) {
      nextErrors.email = 'Некорректный email';
    }

    if (!values.phone.trim()) {
      nextErrors.phone = 'Введите номер телефона';
    } else if (values.phone.replace(/\D/g, '').length < 6) {
      nextErrors.phone = 'Слишком короткий номер';
    }

    if (!values.message.trim()) {
      nextErrors.message = 'Опишите вашу задачу';
    } else if (values.message.trim().length < 10) {
      nextErrors.message = 'Сообщение слишком короткое';
    }

    return nextErrors;
  };

  const handleChange = (
    field: keyof ContactRequestFormValues,
    value: string,
  ) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }));

    if (isSubmitted) {
      setIsSubmitted(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    console.log('Contact request data:', values);

    setIsSubmitted(true);
    setValues(initialValues);
  };

  return (
    <form id="contact-form" className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form__grid">
        <Input
          label="Имя"
          placeholder="Введите имя"
          value={values.name}
          onChange={(event) => handleChange('name', event.target.value)}
          error={errors.name}
        />

        <Input
          label="Email"
          type="email"
          placeholder="Введите email"
          value={values.email}
          onChange={(event) => handleChange('email', event.target.value)}
          error={errors.email}
        />

        <Input
          label="Телефон"
          placeholder="Введите номер телефона"
          value={values.phone}
          onChange={(event) => handleChange('phone', event.target.value)}
          error={errors.phone}
        />

        <div className="contact-form__message">
          <Textarea
            label="Сообщение"
            placeholder="Опишите ваш запрос"
            value={values.message}
            onChange={(event) => handleChange('message', event.target.value)}
            error={errors.message}
          />
        </div>
      </div>

      <div className="contact-form__actions">
        <Button type="submit" disabled={!isFormFilled}>
          Отправить заявку
        </Button>

        {isSubmitted ? (
          <p className="contact-form__success">
            Заявка заполнена. Следующий шаг — подключить реальный API.
          </p>
        ) : null}
      </div>
    </form>
  );
};