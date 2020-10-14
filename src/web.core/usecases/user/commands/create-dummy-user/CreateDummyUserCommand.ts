import { GenderType } from '../../../../domain/enums/user/GenderType';
import { ICommand } from '../../../../domain/common/usecase/interfaces/ICommand';
import { RoleId } from '../../../../domain/enums/role/RoleId';

export class DummyUser {
    roleId: RoleId;
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    gender?: GenderType;
    avatar?: string;
}

export class CreateDummyUserCommand implements ICommand {
    users: DummyUser[];
}
