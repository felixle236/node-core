import { IDbQueryRunner } from '@shared/database/interfaces/IDbQueryRunner';
import { TraceRequest } from '@shared/request/TraceRequest';
import { UserAuthenticated } from '@shared/UserAuthenticated';

export class HandleOption {
    trace: TraceRequest;
    userAuth: UserAuthenticated | null;
    queryRunner: IDbQueryRunner | null;
}
