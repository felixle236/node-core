import { IDbQueryRunner } from '@shared/database/interfaces/IDbQueryRunner';
import { UserAuthenticated } from '@shared/UserAuthenticated';

export class HandleOption {
    trace: string;
    userAuth: UserAuthenticated | null;
    queryRunner: IDbQueryRunner | null;
}
