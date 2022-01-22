import { UserAuthenticated } from 'shared/request/UserAuthenticated';
import { LogTracing } from './LogTracing';

export interface IRequest {
  tracing: LogTracing;
  userAuth?: UserAuthenticated;
}
