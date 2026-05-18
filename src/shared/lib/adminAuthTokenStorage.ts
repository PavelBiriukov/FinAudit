const ADMIN_AUTH_TOKEN_KEY = 'auditpro_admin_auth_token';

export const adminAuthTokenStorage = {
  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.sessionStorage.getItem(ADMIN_AUTH_TOKEN_KEY);
  },

  setToken(token: string) {
    if (typeof window === 'undefined') {
      return;
    }

    window.sessionStorage.setItem(ADMIN_AUTH_TOKEN_KEY, token);
  },

  clearToken() {
    if (typeof window === 'undefined') {
      return;
    }

    window.sessionStorage.removeItem(ADMIN_AUTH_TOKEN_KEY);
  },
};