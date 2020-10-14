import { ICommand } from '../../../../domain/common/interactor/interfaces/ICommand';

export class ActiveUserCommand implements ICommand {
    email: string;
    activeKey: string;
}
