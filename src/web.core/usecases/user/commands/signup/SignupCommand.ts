import { ICommand } from '../../../../domain/common/interactor/interfaces/ICommand';

export class SignupCommand implements ICommand {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
}
