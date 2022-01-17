import { Request, Response } from 'express';
import { DbQuerySession } from 'shared/database/DbTypes';
import { TraceRequest } from 'shared/request/TraceRequest';
import { UserAuthenticated } from 'shared/request/UserAuthenticated';

export class UsecaseOption {
  req: Request;
  res: Response;
  locale?: string;
  trace: TraceRequest;
  userAuth?: UserAuthenticated;
  querySession?: DbQuerySession;
}
