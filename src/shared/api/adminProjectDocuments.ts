import { apiRequest } from './base';
import { getAdminRequestHeaders } from './adminAuth';
import type { ProjectDocument } from '../types/project';

type UploadAdminProjectDocumentResponse = {
  success: boolean;
  message: string;
  data: ProjectDocument;
};

type UploadAdminProjectDocumentPayload = {
  title: string;
  file: File;
};

export const uploadAdminProjectDocument = (
  projectId: string,
  payload: UploadAdminProjectDocumentPayload,
) => {
  const formData = new FormData();

  formData.append('title', payload.title);
  formData.append('file', payload.file);

  return apiRequest<UploadAdminProjectDocumentResponse>(
    `/admin/projects/${projectId}/documents`,
    {
      method: 'POST',
      body: formData,
      headers: getAdminRequestHeaders(),
    },
  );
};