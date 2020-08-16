import { GenderType } from '../../../domain/enums/GenderType';

export class UpdateUserInput {
    id: number;
    firstName: string;
    lastName?: string;
    gender?: GenderType;
    birthday?: string;
    phone?: string;
    address?: string;
    culture?: string;
    currency?: string;
}
