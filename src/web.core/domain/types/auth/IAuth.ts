
import { AuthType } from '../../enums/auth/AuthType';
import { IEntity } from '../base/IEntity';
import { IUser } from '../user/IUser';

export interface IAuth extends IEntity {
    id: string;
    userId: string;
    type: AuthType;
    username: string;
    password: string;
    forgotKey: string | null;
    forgotExpire: Date | null;

    user: IUser | null;
}
