import { AuthType } from '@domain/enums/auth/AuthType';
import { IEntity } from '../base/IEntity';
import { IUser } from '../user/IUser';

export interface IAuth extends IEntity<string> {
    userId: string;
    type: AuthType;
    username: string;
    password: string;
    forgotKey: string | null;
    forgotExpire: Date | null;

    /* Relationship */

    user: IUser | null;
}
