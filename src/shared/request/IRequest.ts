import { ILogService } from 'application/interfaces/services/ILogService';
import { UserAuthenticated } from 'shared/request/UserAuthenticated';
import { TraceRequest } from './TraceRequest';

export interface IRequest {
  trace: TraceRequest;
  logService: ILogService;
  userAuth?: UserAuthenticated;
}
