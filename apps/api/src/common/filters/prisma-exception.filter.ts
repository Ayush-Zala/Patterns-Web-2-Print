import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Prisma } from '@patterns/prisma';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error';

    switch (exception.code) {
      case 'P2002':
        status = HttpStatus.CONFLICT;
        message = `Unique constraint failed on the fields: ${(exception.meta?.target as string[])?.join(', ')}`;
        break;
      case 'P2003':
        status = HttpStatus.BAD_REQUEST;
        message = `Foreign key constraint failed on the field: ${exception.meta?.field_name}`;
        break;
      case 'P2014':
        status = HttpStatus.BAD_REQUEST;
        message = `The change you are trying to make would violate the required relation between models.`;
        break;
      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        message = `Record not found.`;
        break;
      default:
        message = `[${exception.code}]: ${exception.message}`;
        break;
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: 'PrismaClientKnownRequestError',
    });
  }
}
