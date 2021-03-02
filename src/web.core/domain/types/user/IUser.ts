import { RoleId } from '../../enums/role/RoleId';
import { GenderType } from '../../enums/user/GenderType';
import { IEntity } from '../base/IEntity';
import { IRole } from '../role/IRole';

export interface IUser extends IEntity {
    id: string;
    roleId: RoleId;
    firstName: string;
    lastName: string | null;
    avatar: string | null;
    gender: GenderType | null;
    birthday: Date | null;

    role: IRole | null;
}
