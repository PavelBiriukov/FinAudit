import { apiRequest } from './base';
import { getClientRequestHeaders } from './clientAuth';
import type { ProjectTask } from '../types/projectTask';

type GetClientProjectTasksResponse = {
  success: boolean;
  data: ProjectTask[];
};

export const getClientProjectTasks = (projectId: string) => {
  return apiRequest<GetClientProjectTasksResponse>(
    `/client/projects/${projectId}/tasks`,
    {
      method: 'GET',
      headers: getClientRequestHeaders(),
    },
  );
};