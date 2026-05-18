import type { AdminComment } from './adminComment';
import type { ProjectStatus } from './project';

export type ContactRequestStatus = 'NEW' | 'IN_REVIEW' | 'PROCESSED';

export type ContactRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: ContactRequestStatus;
  createdAt: string;
  updatedAt: string;
};

export type ContactRequestClient = {
  id: string;
  email: string;
  fullName: string;
  role: 'CLIENT';
};

export type ContactRequestProject = {
  id: string;
  title: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
};

export type ContactRequestDetails = ContactRequest & {
  client: ContactRequestClient | null;
  project: ContactRequestProject | null;
  comments: AdminComment[];
};

export type ContactRequestListMeta = {
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};