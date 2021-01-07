import { RoleId } from '../../enums/role/RoleId';
import { GenderType } from '../../enums/user/GenderType';
import { UserStatus } from '../../enums/user/UserStatus';
import { IEntity } from '../base/IEntity';
import { IRole } from '../role/IRole';

export interface IUser extends IEntity {
    id: string;
    roleId: RoleId;
    status: UserStatus;
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    avatar?: string;
    gender?: GenderType;
    birthday?: Date;
    phone?: string;
    address?: string;
    culture?: string;
    currency?: string;
    activeKey?: string;
    activeExpire?: Date;
    activedAt?: Date;
    archivedAt?: Date;
    forgotKey?: string;
    forgotExpire?: Date;

    role?: IRole;
}
