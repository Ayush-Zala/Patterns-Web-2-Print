import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { RequestContext } from '@patterns/types';
import { Request } from 'express';

export const CONTEXT_CACHE_KEY = Symbol('CONTEXT_CACHE_KEY');

@Injectable({ scope: Scope.REQUEST })
export class ContextProvider {
  constructor(@Inject(REQUEST) private request: Request) {}

  getContext(): RequestContext {
    return (this.request as any).context;
  }
}
