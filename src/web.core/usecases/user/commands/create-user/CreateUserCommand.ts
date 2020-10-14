import { GenderType } from '../../../../domain/enums/user/GenderType';
import { ICommand } from '../../../../domain/common/usecase/interfaces/ICommand';
import { RoleId } from '../../../../domain/enums/role/RoleId';

export class CreateUserCommand implements ICommand {
    roleId: RoleId;
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
}
