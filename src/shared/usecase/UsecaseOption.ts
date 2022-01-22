import { Request, Response } from 'express';
import { DbQuerySession } from 'shared/database/DbTypes';
import { LogTracing } from 'shared/request/LogTracing';
import { UserAuthenticated } from 'shared/request/UserAuthenticated';

export class UsecaseOption {
  req: Request;
  res: Response;
  locale?: string;
  tracing: LogTracing;
  userAuth?: UserAuthenticated;
  querySession?: DbQuerySession;
}
