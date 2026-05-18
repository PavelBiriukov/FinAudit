import { apiRequest } from './base';
import { getAdminRequestHeaders } from './adminAuth';
import type {
  ProjectTask,
  ProjectTaskPriority,
  ProjectTaskStatus,
} from '../types/projectTask';

type GetAdminProjectTasksResponse = {
  success: boolean;
  data: ProjectTask[];
};

type CreateAdminProjectTaskResponse = {
  success: boolean;
  message: string;
  data: ProjectTask;
};

type UpdateAdminProjectTaskStatusResponse = {
  success: boolean;
  message: string;
  data: ProjectTask;
};

type CreateAdminProjectTaskPayload = {
  title: string;
  description?: string;
  priority?: ProjectTaskPriority;
};

export const getAdminProjectTasks = (projectId: string) => {
  return apiRequest<GetAdminProjectTasksResponse>(
    `/admin/projects/${projectId}/tasks`,
    {
      method: 'GET',
      headers: getAdminRequestHeaders(),
    },
  );
};

export const createAdminProjectTask = (
  projectId: string,
  payload: CreateAdminProjectTaskPayload,
) => {
  return apiRequest<CreateAdminProjectTaskResponse>(
    `/admin/projects/${projectId}/tasks`,
    {
      method: 'POST',
      body: payload,
      headers: getAdminRequestHeaders(),
    },
  );
};

export const updateAdminProjectTaskStatus = (
  taskId: string,
  status: ProjectTaskStatus,
) => {
  return apiRequest<UpdateAdminProjectTaskStatusResponse>(
    `/admin/project-tasks/${taskId}/status`,
    {
      method: 'PATCH',
      body: { status },
      headers: getAdminRequestHeaders(),
    },
  );
};