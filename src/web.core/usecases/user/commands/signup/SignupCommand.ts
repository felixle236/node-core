import { ICommand } from '../../../../domain/common/usecase/interfaces/ICommand';

export class SignupCommand implements ICommand {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
}
