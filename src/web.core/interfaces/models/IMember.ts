import { Gender } from '../../../constants/Enums';
import { RoleResponse } from '../../dtos/role/responses/RoleResponse';

export interface IMember {
    id: number;
    roleId: number;
    firstName: string;
    lastName?: string;
    email: string;
    avatar?: string;
    gender?: Gender;
    birthday?: Date;
    phone?: string;
    address?: string;
    culture?: string;
    currency?: string;
    isOnline: boolean;
    hasNewMessage: boolean;

    role?: RoleResponse;
}
