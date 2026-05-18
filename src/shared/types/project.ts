export type ProjectStatus =
  | 'NEW'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_CLIENT'
  | 'COMPLETED'
  | 'ARCHIVED';

export type ProjectManager = {
  id: string;
  email: string;
};

export type ProjectClient = {
  id: string;
  email: string;
  fullName: string;
};

export type ProjectContactRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  status: string;
  createdAt?: string;
};

export type ProjectListItem = {
  id: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  documentsCount: number;
  messagesCount?: number;
  manager: ProjectManager | null;
  client?: ProjectClient;
  contactRequest?: ProjectContactRequest | null;
};

export type ProjectDocument = {
  id: string;
  title: string;
  fileUrl: string;
  mimeType: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProjectDetails = {
  id: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  manager: ProjectManager | null;
  client: ProjectClient;
  contactRequest: ProjectContactRequest | null;
  documents: ProjectDocument[];
};