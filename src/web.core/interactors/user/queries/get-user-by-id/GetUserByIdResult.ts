import { GenderType } from '../../../../domain/enums/GenderType';
import { Role } from '../../../../domain/entities/role/Role';
import { User } from '../../../../domain/entities/user/User';

class RoleResult {
    id: string;
    name: string;

    constructor(data: Role) {
        this.id = data.id;
        this.name = data.name;
    }
}

export class GetUserByIdResult {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    roleId: string;
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
    activedAt?: Date;
    archivedAt?: Date;

    role?: RoleResult;

    constructor(data: User) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.deletedAt = data.deletedAt;
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
        this.activedAt = data.activedAt;
        this.archivedAt = data.archivedAt;

        this.role = data.role && new RoleResult(data.role);
    }
}
