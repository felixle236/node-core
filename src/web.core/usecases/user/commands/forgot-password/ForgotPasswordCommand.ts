import { ICommand } from '../../../../domain/common/interactor/interfaces/ICommand';

export class ForgotPasswordCommand implements ICommand {
    email: string;
}
