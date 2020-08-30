import { ICommand } from '../../../../domain/common/interactor/interfaces/ICommand';

export class DeleteUserCommand implements ICommand {
    id: string;

    roleAuthLevel: number;
}
