import { ICommand } from '../../../../domain/common/usecase/interfaces/ICommand';

export class ResetPasswordCommand implements ICommand {
    forgotKey: string;
    email: string;
    password: string;
}
