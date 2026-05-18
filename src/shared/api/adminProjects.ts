import { apiRequest } from './base';
import { getAdminRequestHeaders } from './adminAuth';
import type {
  ProjectDetails,
  ProjectListItem,
  ProjectStatus,
} from '../types/project';

type GetAdminProjectsResponse = {
  success: boolean;
  data: ProjectListItem[];
};

type GetAdminProjectByIdResponse = {
  success: boolean;
  data: ProjectDetails;
};

type UpdateAdminProjectStatusResponse = {
  success: boolean;
  message: string;
  data: ProjectListItem;
};

export const getAdminProjects = () => {
  return apiRequest<GetAdminProjectsResponse>('/admin/projects', {
    method: 'GET',
    headers: getAdminRequestHeaders(),
  });
};

export const getAdminProjectById = (id: string) => {
  return apiRequest<GetAdminProjectByIdResponse>(`/admin/projects/${id}`, {
    method: 'GET',
    headers: getAdminRequestHeaders(),
  });
};

export const updateAdminProjectStatus = (
  id: string,
  status: ProjectStatus,
) => {
  return apiRequest<UpdateAdminProjectStatusResponse>(
    `/admin/projects/${id}/status`,
    {
      method: 'PATCH',
      body: { status },
      headers: getAdminRequestHeaders(),
    },
  );
};