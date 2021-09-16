import { ILogService } from '@gateways/services/ILogService';
import { Request } from 'express';
import { TraceRequest } from './TraceRequest';
import { UserAuthenticated } from '../UserAuthenticated';

export interface IRequest extends Request {
    trace: TraceRequest;
    logService: ILogService;
    userAuth: UserAuthenticated | null;
}
