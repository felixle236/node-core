import { GenderType } from '../../../../domain/enums/GenderType';
import { ICommand } from '../../../../domain/common/interactor/interfaces/ICommand';

export class CreateUserCommand implements ICommand {
    roleId: string;
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    gender?: GenderType;
    birthday?: string;
    phone?: string;
    address?: string;
    culture?: string;
    currency?: string;

    roleAuthLevel: number;
}
