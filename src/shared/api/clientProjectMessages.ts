import { apiRequest } from './base';
import { getClientRequestHeaders } from './clientAuth';
import type { ProjectMessage } from '../types/projectMessage';

type GetClientProjectMessagesResponse = {
  success: boolean;
  data: ProjectMessage[];
};

type CreateClientProjectMessageResponse = {
  success: boolean;
  message: string;
  data: ProjectMessage;
};

export const getClientProjectMessages = (projectId: string) => {
  return apiRequest<GetClientProjectMessagesResponse>(
    `/client/projects/${projectId}/messages`,
    {
      method: 'GET',
      headers: getClientRequestHeaders(),
    },
  );
};

export const createClientProjectMessage = (
  projectId: string,
  text: string,
) => {
  return apiRequest<CreateClientProjectMessageResponse>(
    `/client/projects/${projectId}/messages`,
    {
      method: 'POST',
      body: { text },
      headers: getClientRequestHeaders(),
    },
  );
};