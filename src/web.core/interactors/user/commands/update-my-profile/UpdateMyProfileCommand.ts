import { GenderType } from '../../../../domain/enums/GenderType';
import { ICommand } from '../../../../domain/common/interactor/interfaces/ICommand';

export class UpdateMyProfileCommand implements ICommand {
    userAuthId: string;
    firstName: string;
    lastName?: string;
    gender?: GenderType;
    birthday?: string;
    phone?: string;
    address?: string;
    culture?: string;
    currency?: string;
}
