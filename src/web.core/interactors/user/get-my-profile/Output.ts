import { GenderType } from '../../../domain/enums/GenderType';
import { Role } from '../../../domain/entities/Role';
import { User } from '../../../domain/entities/User';

export class GetMyProfileOutput {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    roleId: number;
    firstName: string;
    lastName?: string;
    email: string;
    avatar?: string;
    gender?: GenderType;
    birthday?: string;
    phone?: string;
    address?: string;
    culture?: string;
    currency?: string;

    role?: RoleOutput;

    constructor(data: User) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.roleId = data.roleId;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.avatar = data.avatar;
        this.gender = data.gender;
        this.birthday = data.birthdayDisplay;
        this.phone = data.phone;
        this.address = data.address;
        this.culture = data.culture;
        this.currency = data.currency;

        this.role = data.role && new RoleOutput(data.role);
    }
}

class RoleOutput {
    id: number;
    name: string;

    constructor(data: Role) {
        this.id = data.id;
        this.name = data.name;
    }
}
