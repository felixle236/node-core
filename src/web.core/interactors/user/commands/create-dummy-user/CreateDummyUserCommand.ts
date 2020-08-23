import { GenderType } from '../../../../domain/enums/GenderType';
import { ICommand } from '../../../../domain/common/interactor/interfaces/ICommand';

export class CreateDummyUserCommand implements ICommand {
    users: DummyUser[];
}

export class DummyUser {
    roleId: string;
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    gender?: GenderType;
    avatar?: string;
}
