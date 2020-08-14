import { GenderType } from '../../../domain/enums/GenderType';

export class CreateDummyUserInput {
    users: IDummyUser[];
}

interface IDummyUser {
    roleId: number;
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    gender?: GenderType;
    avatar?: string;
}
