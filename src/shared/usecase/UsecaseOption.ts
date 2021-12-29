import { DbQuerySession } from 'shared/database/DbTypes';
import { IRequest } from 'shared/request/IRequest';
import { TraceRequest } from 'shared/request/TraceRequest';
import { UserAuthenticated } from 'shared/request/UserAuthenticated';

export class UsecaseOption {
    req: IRequest;
    res: Response;
    locale?: string;
    trace: TraceRequest;
    userAuth?: UserAuthenticated;
    querySession?: DbQuerySession;
}
