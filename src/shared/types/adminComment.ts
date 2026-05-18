import type { AdminUser } from './adminAuth';

export type AdminComment = {
  id: string;
  text: string;
  contactRequestId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: AdminUser;
};