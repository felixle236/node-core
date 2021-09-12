import { ILogService } from '@gateways/services/ILogService';
import { Request } from 'express';
import { UserAuthenticated } from './UserAuthenticated';

export interface IRequest extends Request {
    userAuth: UserAuthenticated | null;
    logService: ILogService;
    getTraceHeader(): string;
}
