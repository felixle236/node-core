import { GenderType } from '../../../../domain/enums/user/GenderType';
import { ICommand } from '../../../../domain/common/usecase/interfaces/ICommand';

export class UpdateUserCommand implements ICommand {
    id: string;
    firstName: string;
    lastName?: string;
    gender?: GenderType;
    birthday?: string;
    phone?: string;
    address?: string;
    culture?: string;
    currency?: string;
}
