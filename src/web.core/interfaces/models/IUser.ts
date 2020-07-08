import { GenderType, UserStatus } from '../../../constants/Enums';
import { IRole } from './IRole';

export interface IUser {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    roleId: number;
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
