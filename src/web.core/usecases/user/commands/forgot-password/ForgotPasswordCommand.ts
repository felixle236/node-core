import { ICommand } from '../../../../domain/common/usecase/interfaces/ICommand';

export class ForgotPasswordCommand implements ICommand {
    email: string;
}
