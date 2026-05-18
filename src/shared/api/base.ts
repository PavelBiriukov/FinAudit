export const API_BASE_URL = 'http://localhost:4000/api';

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

type ApiErrorResponse = {
  message?: string;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { body, headers, ...restOptions } = options;

  const requestHeaders = new Headers(headers);

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  if (body !== undefined && !isFormData) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    headers: requestHeaders,
    body:
      body === undefined
        ? undefined
        : isFormData
          ? body
          : JSON.stringify(body),
  });

  if (!response.ok) {
    let errorMessage = 'Не удалось выполнить запрос';

    try {
      const errorData = (await response.json()) as ApiErrorResponse;

      if (typeof errorData.message === 'string' && errorData.message.trim()) {
        errorMessage = errorData.message;
      }
    } catch {
      errorMessage = `Ошибка запроса: ${response.status}`;
    }

    throw new ApiError(errorMessage, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}