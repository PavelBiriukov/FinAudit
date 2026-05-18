import { apiRequest } from './base';
import { getAdminRequestHeaders } from './adminAuth';
import type { ProjectMessage } from '../types/projectMessage';

type GetAdminProjectMessagesResponse = {
  success: boolean;
  data: ProjectMessage[];
};

type CreateAdminProjectMessageResponse = {
  success: boolean;
  message: string;
  data: ProjectMessage;
};

export const getAdminProjectMessages = (projectId: string) => {
  return apiRequest<GetAdminProjectMessagesResponse>(
    `/admin/projects/${projectId}/messages`,
    {
      method: 'GET',
      headers: getAdminRequestHeaders(),
    },
  );
};

export const createAdminProjectMessage = (
  projectId: string,
  text: string,
) => {
  return apiRequest<CreateAdminProjectMessageResponse>(
    `/admin/projects/${projectId}/messages`,
    {
      method: 'POST',
      body: { text },
      headers: getAdminRequestHeaders(),
    },
  );
};