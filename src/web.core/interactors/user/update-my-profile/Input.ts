import { GenderType } from '../../../domain/enums/GenderType';

export class UpdateMyProfileInput {
    firstName: string;
    lastName?: string;
    gender?: GenderType;
    birthday?: string;
    phone?: string;
    address?: string;
    culture?: string;
    currency?: string;
}
