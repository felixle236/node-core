import { GenderType } from '../../../../constants/Enums';

export class UserUpdateData {
    firstName: string;
    lastName?: string;
    avatar?: string;
    gender?: GenderType;
    birthday?: Date;
    phone?: string;
    address?: string;
    culture?: string;
    currency?: string;
}
