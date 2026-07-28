import { toast } from 'sonner';

export interface AppError {
  status: number;
  message: string;
  code?: string;
  details?: any;
}

export function handleApiError(error: any, customTitle?: string): AppError {
  const status = error?.status || 500;
  let message = error?.message || 'An unexpected error occurred';

  if (error?.data?.message) {
    if (Array.isArray(error.data.message)) {
      message = error.data.message.join(', ');
    } else {
      message = error.data.message;
    }
  }

  const appError: AppError = {
    status,
    message,
    code: error?.data?.error?.code,
    details: error?.data?.details,
  };

  switch (status) {
    case 400:
      toast.error(customTitle || 'Bad Request', { description: message });
      break;
    case 401:
      // Silently handled or redirected via session expired modal
      break;
    case 403:
      toast.error('Permission Denied', {
        description: message || 'You do not have access to this resource.',
      });
      break;
    case 404:
      toast.error('Not Found', { description: message || 'The requested resource was not found.' });
      break;
    case 409:
      toast.error('Conflict Error', { description: message });
      break;
    case 422:
      toast.error('Validation Error', { description: message });
      break;
    case 500:
    default:
      toast.error('Server Error', {
        description: message || 'Something went wrong on the server. Please try again later.',
      });
      break;
  }

  return appError;
}
