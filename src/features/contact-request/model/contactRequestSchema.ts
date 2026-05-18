import { z } from 'zod';

export const contactRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: 'Введите имя' })
    .min(2, { error: 'Имя слишком короткое' })
    .max(100, { error: 'Имя слишком длинное' }),

  email: z
    .string()
    .trim()
    .min(1, { error: 'Введите email' })
    .pipe(z.email({ error: 'Некорректный email' })),

  phone: z
    .string()
    .trim()
    .min(1, { error: 'Введите номер телефона' })
    .max(30, { error: 'Номер слишком длинный' })
    .refine((value) => value.replace(/\D/g, '').length >= 6, {
      error: 'Слишком короткий номер телефона',
    }),

  message: z
    .string()
    .trim()
    .min(1, { error: 'Опишите задачу' })
    .min(10, { error: 'Сообщение слишком короткое' })
    .max(2000, { error: 'Сообщение слишком длинное' }),
});

export type ContactRequestFormValues = z.infer<typeof contactRequestSchema>;