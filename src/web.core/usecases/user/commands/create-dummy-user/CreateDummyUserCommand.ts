import { RoleId } from '../../../../domain/enums/role/RoleId';
import { GenderType } from '../../../../domain/enums/user/GenderType';

export class DummyUser {
    roleId: RoleId;
    firstName: string;
    lastName: string | null;
    email: string;
    password: string;
    gender: GenderType | null;
    avatar: string | null;
}

export class CreateDummyUserCommand {
    users: DummyUser[];
}
