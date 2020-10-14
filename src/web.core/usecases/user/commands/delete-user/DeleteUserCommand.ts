import { ICommand } from '../../../../domain/common/usecase/interfaces/ICommand';

export class DeleteUserCommand implements ICommand {
    id: string;
}
