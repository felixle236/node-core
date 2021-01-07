import { ICommand } from '../../../../domain/common/usecase/interfaces/ICommand';
import { GenderType } from '../../../../domain/enums/user/GenderType';

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
