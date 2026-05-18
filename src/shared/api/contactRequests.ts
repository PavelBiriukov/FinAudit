import { apiRequest } from './base';
import type {
  ContactRequest,
  ContactRequestDetails,
  ContactRequestListMeta,
  ContactRequestStatus,
} from '../types/contactRequest';
import type { AdminComment } from '../types/adminComment';
import { getAdminRequestHeaders } from './adminAuth';

type GetContactRequestsParams = {
  status?: ContactRequestStatus;
  search?: string;
  page?: number;
  pageSize?: number;
};

type GetContactRequestsResponse = {
  success: boolean;
  data: ContactRequest[];
  meta: ContactRequestListMeta;
};

type GetContactRequestByIdResponse = {
  success: boolean;
  data: ContactRequestDetails;
};

type UpdateContactRequestStatusResponse = {
  success: boolean;
  message: string;
  data: ContactRequest;
};

type CreateAdminCommentResponse = {
  success: boolean;
  message: string;
  data: AdminComment;
};

export const getContactRequests = async ({
  status,
  search,
  page = 1,
  pageSize = 10,
}: GetContactRequestsParams = {}): Promise<GetContactRequestsResponse> => {
  const searchParams = new URLSearchParams();

  if (status) {
    searchParams.set('status', status);
  }

  if (search?.trim()) {
    searchParams.set('search', search.trim());
  }

  searchParams.set('page', String(page));
  searchParams.set('pageSize', String(pageSize));

  const query = searchParams.toString();

  return apiRequest<GetContactRequestsResponse>(
    `/contact-requests${query ? `?${query}` : ''}`,
    {
      method: 'GET',
      headers: getAdminRequestHeaders(),
    },
  );
};

export const getContactRequestById = async (
  id: string,
): Promise<GetContactRequestByIdResponse> => {
  return apiRequest<GetContactRequestByIdResponse>(`/contact-requests/${id}`, {
    method: 'GET',
    headers: getAdminRequestHeaders(),
  });
};

export const changeContactRequestStatus = async (
  id: string,
  status: ContactRequestStatus,
): Promise<UpdateContactRequestStatusResponse> => {
  return apiRequest<UpdateContactRequestStatusResponse>(
    `/contact-requests/${id}/status`,
    {
      method: 'PATCH',
      body: { status },
      headers: getAdminRequestHeaders(),
    },
  );
};

export const createAdminComment = async (
  id: string,
  text: string,
): Promise<CreateAdminCommentResponse> => {
  return apiRequest<CreateAdminCommentResponse>(
    `/contact-requests/${id}/comments`,
    {
      method: 'POST',
      body: { text },
      headers: getAdminRequestHeaders(),
    },
  );
};
type ConvertContactRequestToProjectResponse = {
  success: boolean;
  message: string;
  data: {
    requestId: string;
    createdNewClient: boolean;
    temporaryPassword: string | null;
    client: {
      id: string;
      email: string;
      fullName: string;
    };
    project: {
      id: string;
      title: string;
      status: string;
    };
  };
};

export const convertContactRequestToProject = async (
  id: string,
  payload?: {
    title?: string;
    description?: string;
  },
): Promise<ConvertContactRequestToProjectResponse> => {
  return apiRequest<ConvertContactRequestToProjectResponse>(
    `/admin/contact-requests/${id}/convert-to-project`,
    {
      method: 'POST',
      body: payload ?? {},
      headers: getAdminRequestHeaders(),
    },
  );
};