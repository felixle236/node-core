import { GenderType } from '../../../domain/enums/GenderType';

export class CreateDummyUserInput {
    constructor(
        public users: IDummyUser[] = require('../../../../../resources/sample-data/users.json')
    ) {}
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
