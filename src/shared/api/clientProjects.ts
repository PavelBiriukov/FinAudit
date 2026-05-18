import { apiRequest } from './base';
import { getClientRequestHeaders } from './clientAuth';
import type { ProjectDetails, ProjectListItem } from '../types/project';

type GetClientProjectsResponse = {
  success: boolean;
  data: ProjectListItem[];
};

type GetClientProjectByIdResponse = {
  success: boolean;
  data: ProjectDetails;
};

export const getClientProjects = () => {
  return apiRequest<GetClientProjectsResponse>('/client/projects', {
    method: 'GET',
    headers: getClientRequestHeaders(),
  });
};

export const getClientProjectById = (id: string) => {
  return apiRequest<GetClientProjectByIdResponse>(`/client/projects/${id}`, {
    method: 'GET',
    headers: getClientRequestHeaders(),
  });
};