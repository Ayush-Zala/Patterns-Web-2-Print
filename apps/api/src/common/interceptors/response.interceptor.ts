import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuccessResponse } from '@common/interfaces/success-response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, SuccessResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<SuccessResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // If data is already wrapped (e.g. pagination or custom response), just return it
        if (data && data.success !== undefined) {
          return data as SuccessResponse<T>;
        }

        // Standard wrapper
        return {
          success: true,
          message: 'Request completed successfully',
          data,
        };
      }),
    );
  }
}
