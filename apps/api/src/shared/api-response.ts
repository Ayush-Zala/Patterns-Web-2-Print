import { SuccessResponse } from '@common/interfaces/success-response.interface';
import { ErrorResponse } from '@common/interfaces/error-response.interface';

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
