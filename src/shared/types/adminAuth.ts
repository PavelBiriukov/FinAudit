export type AdminRole = 'ADMIN';

export type AdminUser = {
  id: string;
  email: string;
  role: AdminRole;
};

export type AdminLoginResponse = {
  success: boolean;
  token: string;
  admin: AdminUser;
};

export type AdminMeResponse = {
  success: boolean;
  admin: AdminUser;
};