import { ICommand } from '../../../../domain/common/usecase/interfaces/ICommand';

export class ActiveUserCommand implements ICommand {
    email: string;
    activeKey: string;
}
