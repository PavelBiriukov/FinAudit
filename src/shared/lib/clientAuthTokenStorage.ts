const CLIENT_AUTH_TOKEN_KEY = 'auditpro_client_auth_token';

export const clientAuthTokenStorage = {
  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.sessionStorage.getItem(CLIENT_AUTH_TOKEN_KEY);
  },

  setToken(token: string) {
    if (typeof window === 'undefined') {
      return;
    }

    window.sessionStorage.setItem(CLIENT_AUTH_TOKEN_KEY, token);
  },

  clearToken() {
    if (typeof window === 'undefined') {
      return;
    }

    window.sessionStorage.removeItem(CLIENT_AUTH_TOKEN_KEY);
  },
};