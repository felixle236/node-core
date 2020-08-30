import { ICommand } from '../../../../domain/common/interactor/interfaces/ICommand';

export class ResendActivationCommand implements ICommand {
    email: string;
}
