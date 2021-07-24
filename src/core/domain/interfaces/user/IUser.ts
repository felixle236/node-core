import { GenderType } from '@domain/enums/user/GenderType';
import { IAuth } from '../auth/IAuth';
import { IEntity } from '../base/IEntity';

export interface IUser extends IEntity<string> {
    roleId: string;
    firstName: string;
    lastName: string | null;
    avatar: string | null;
    gender: GenderType | null;
    birthday: string | null;

    /* Relationship */

    auths: IAuth[] | null;
}
