import { apiRequest } from './base';
import type {
  ClientLoginResponse,
  ClientMeResponse,
} from '../types/clientAuth';
import { clientAuthTokenStorage } from '../lib/clientAuthTokenStorage';

type LoginClientPayload = {
  email: string;
  password: string;
};

const getClientAuthHeaders = (): HeadersInit => {
  const token = clientAuthTokenStorage.getToken();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const loginClient = (payload: LoginClientPayload) => {
  return apiRequest<ClientLoginResponse>('/client/auth/login', {
    method: 'POST',
    body: payload,
  });
};

export const getClientMe = () => {
  return apiRequest<ClientMeResponse>('/client/auth/me', {
    method: 'GET',
    headers: getClientAuthHeaders(),
  });
};

export const getClientRequestHeaders = getClientAuthHeaders;