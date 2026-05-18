import { apiRequest } from './base';
import type {
  AdminLoginResponse,
  AdminMeResponse,
} from '../types/adminAuth';
import { adminAuthTokenStorage } from '../lib/adminAuthTokenStorage';

type LoginAdminPayload = {
  email: string;
  password: string;
};

const getAdminAuthHeaders = (): HeadersInit => {
    const token = adminAuthTokenStorage.getToken();
  
    if (!token) {
      return {};
    }
  
    return {
      Authorization: `Bearer ${token}`,
    };
};

export const loginAdmin = (payload: LoginAdminPayload) => {
  return apiRequest<AdminLoginResponse>('/admin/auth/login', {
    method: 'POST',
    body: payload,
  });
};

export const getAdminMe = () => {
  return apiRequest<AdminMeResponse>('/admin/auth/me', {
    method: 'GET',
    headers: getAdminAuthHeaders(),
  });
};

export const getAdminRequestHeaders = getAdminAuthHeaders;