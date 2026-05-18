export type ProjectMessageAuthorType = 'ADMIN' | 'CLIENT';

export type ProjectMessageAdminAuthor = {
  id: string;
  email: string;
  role: 'ADMIN';
};

export type ProjectMessageClientAuthor = {
  id: string;
  email: string;
  fullName: string;
  role: 'CLIENT';
};

export type ProjectMessage = {
  id: string;
  text: string;
  authorType: ProjectMessageAuthorType;
  projectId: string;
  authorAdminId: string | null;
  authorClientId: string | null;
  createdAt: string;
  updatedAt: string;
  authorAdmin: ProjectMessageAdminAuthor | null;
  authorClient: ProjectMessageClientAuthor | null;
};