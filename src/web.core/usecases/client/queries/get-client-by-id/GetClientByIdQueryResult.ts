import { Client } from '../../../../domain/entities/client/Client';
import { Role } from '../../../../domain/entities/role/Role';
import { GenderType } from '../../../../domain/enums/user/GenderType';

class RoleResult {
    id: string;
    name: string;

    constructor(data: Role) {
        this.id = data.id;
        this.name = data.name;
    }
}

export class GetClientByIdQueryResult {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    roleId: string;
    firstName: string;
    lastName: string | null;
    email: string;
    avatar: string | null;
    gender: GenderType | null;
    birthday: string | null;
    phone: string | null;
    address: string | null;
    culture: string | null;
    currency: string | null;
    activedAt: Date | null;
    archivedAt: Date | null;

    role: RoleResult | null;

    constructor(data: Client) {
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
