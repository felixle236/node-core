import { GenderType } from '../../../../constants/Enums';
import { Type } from 'class-transformer';

export class UserUpdateRequest {
    firstName: string;
    lastName?: string;
    gender?: GenderType;

    @Type(/* istanbul ignore next */ () => Date)
    birthday?: Date;

    phone?: string;
    address?: string;
    culture?: string;
    currency?: string;
}
