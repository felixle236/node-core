import { GenderType } from '../../../constants/Enums';
import { IRole } from './IRole';

export interface IUser {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    roleId: number;
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
    forgotKey?: string;
    forgotExpire?: Date;

    role?: IRole;
}
