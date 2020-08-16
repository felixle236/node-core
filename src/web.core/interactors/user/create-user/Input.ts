import { GenderType } from '../../../domain/enums/GenderType';

export class CreateUserInput {
    roleId: number;
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    gender?: GenderType;
    birthday?: string;
    phone?: string;
    address?: string;
    culture?: string;
    currency?: string;
}
