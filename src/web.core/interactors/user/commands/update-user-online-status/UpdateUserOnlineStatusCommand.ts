import { ICommand } from '../../../../domain/common/interactor/interfaces/ICommand';

export class UpdateUserOnlineStatusCommand implements ICommand {
    id: string;
    isOnline: boolean;
}
