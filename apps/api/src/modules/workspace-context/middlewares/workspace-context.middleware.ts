import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { HEADERS } from '@patterns/constants';
import * as crypto from 'crypto';

@Injectable()
export class WorkspaceContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req.headers[HEADERS.REQUEST_ID] = req.headers[HEADERS.REQUEST_ID] || crypto.randomUUID();
    (req as any).startTime = Date.now();
    next();
  }
}
