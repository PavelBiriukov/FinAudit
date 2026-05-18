export type ProjectTaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED';

export type ProjectTaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export type ProjectTaskAdminUser = {
  id: string;
  email: string;
  role: 'ADMIN';
};

export type ProjectTask = {
  id: string;
  title: string;
  description: string | null;
  status: ProjectTaskStatus;
  priority: ProjectTaskPriority;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  createdByAdmin: ProjectTaskAdminUser | null;
  assigneeAdmin: ProjectTaskAdminUser | null;
};