import { GenderType } from '../../../../constants/Enums';
import { Type } from 'class-transformer';

export class UserCreateRequest {
    roleId: number;
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    gender?: GenderType;

    @Type(/* istanbul ignore next */ () => Date)
    birthday?: Date;

    phone?: string;
    address?: string;
    culture?: string;
    currency?: string;
}
