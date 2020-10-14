import { ICommand } from '../../../../domain/common/usecase/interfaces/ICommand';

export class ResendActivationCommand implements ICommand {
    email: string;
}
