import { ICommand } from '../../../../domain/common/interactor/interfaces/ICommand';

export class ResetPasswordCommand implements ICommand {
    forgotKey: string;
    email: string;
    password: string;
}
