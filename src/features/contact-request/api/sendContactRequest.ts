import { apiRequest } from '../../../shared/api/base';
import { ContactRequestFormValues } from '../model/contactRequestSchema';

export type SendContactRequestResponse = {
  success: boolean;
  message: string;
};

export const sendContactRequest = (
  payload: ContactRequestFormValues,
): Promise<SendContactRequestResponse> => {
  return apiRequest<SendContactRequestResponse>('/contact-requests', {
    method: 'POST',
    body: payload,
  });
};