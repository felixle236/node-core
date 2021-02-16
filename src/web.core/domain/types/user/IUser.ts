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
    lastName: string | null;
    email: string;
    password: string;
    avatar: string | null;
    gender: GenderType | null;
    birthday: Date | null;
    phone: string | null;
    address: string | null;
    culture: string | null;
    currency: string | null;
    activeKey: string | null;
    activeExpire: Date | null;
    activedAt: Date | null;
    archivedAt: Date | null;
    forgotKey: string | null;
    forgotExpire: Date | null;

    role: IRole | null;
}
