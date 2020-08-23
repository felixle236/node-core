import { ICommand } from '../../../../domain/common/interactor/interfaces/ICommand';

export class UpdateMyPasswordCommand implements ICommand {
    id: string;
    password: string;
    newPassword: string;
}
