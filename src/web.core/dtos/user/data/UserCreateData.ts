import { GenderType, UserStatus } from '../../../../constants/Enums';

export class UserCreateData {
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
}
