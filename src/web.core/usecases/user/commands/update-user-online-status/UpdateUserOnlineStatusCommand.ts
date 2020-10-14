import { ICommand } from '../../../../domain/common/usecase/interfaces/ICommand';

export class UpdateUserOnlineStatusCommand implements ICommand {
    id: string;
    isOnline: boolean;
}
