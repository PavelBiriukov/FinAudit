export type ClientRole = 'CLIENT';

export type ClientUser = {
  id: string;
  email: string;
  fullName: string;
  role: ClientRole;
};

export type ClientLoginResponse = {
  success: boolean;
  token: string;
  client: ClientUser;
};

export type ClientMeResponse = {
  success: boolean;
  client: ClientUser;
};