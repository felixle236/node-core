import { RoleId } from '../../../../domain/enums/role/RoleId';
import { GenderType } from '../../../../domain/enums/user/GenderType';

export class CreateUserCommand {
    roleId: RoleId;
    firstName: string;
    lastName: string | null;
    email: string;
    password: string;
    gender: GenderType | null;
    birthday: string | null;
    phone: string | null;
    address: string | null;
    culture: string | null;
    currency: string | null;
}
