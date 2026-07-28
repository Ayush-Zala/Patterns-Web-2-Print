import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestContext } from '@patterns/types';

export const CurrentContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestContext => {
    const request = ctx.switchToHttp().getRequest();
    return request.context;
  },
);
