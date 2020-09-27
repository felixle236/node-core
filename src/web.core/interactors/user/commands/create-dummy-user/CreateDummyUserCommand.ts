import { GenderType } from '../../../../domain/enums/GenderType';
import { ICommand } from '../../../../domain/common/interactor/interfaces/ICommand';
import { RoleId } from '../../../../domain/enums/RoleId';

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
