import { ILogService } from 'application/interfaces/services/ILogService';
import { Request } from 'express';
import { UserAuthenticated } from 'shared/request/UserAuthenticated';
import { TraceRequest } from './TraceRequest';

export interface IRequest extends Request {
    trace: TraceRequest;
    logService: ILogService;
    userAuth?: UserAuthenticated;
}
