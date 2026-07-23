import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { REQUEST_ID_HEADER } from '@common/constants/header.constants';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestId = req.headers[REQUEST_ID_HEADER] || randomUUID();
    
    // Ensure header is set on the request object for downstream use
    req.headers[REQUEST_ID_HEADER] = requestId;
    
    // Set header on the response object
    res.setHeader(REQUEST_ID_HEADER, requestId);
    
    next();
  }
}
