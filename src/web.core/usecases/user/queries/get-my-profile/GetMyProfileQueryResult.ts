import { Role } from '../../../../domain/entities/role/Role';
import { User } from '../../../../domain/entities/user/User';
import { GenderType } from '../../../../domain/enums/user/GenderType';

class RoleResult {
    id: string;
    name: string;

    constructor(data: Role) {
        this.id = data.id;
        this.name = data.name;
    }
}

export class GetMyProfileQueryResult {
    id: string;
    createdAt: Date;
    updatedAt: Date;
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

    role: RoleResult | null;

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
        this.birthday = data.birthday;
        this.phone = data.phone;
        this.address = data.address;
        this.culture = data.culture;
        this.currency = data.currency;

        this.role = data.role && new RoleResult(data.role);
    }
}
