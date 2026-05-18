import { API_BASE_URL } from '../api/base';

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

export const getFileUrl = (fileUrl: string) => {
  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
    return fileUrl;
  }

  return `${API_ORIGIN}${fileUrl}`;
};