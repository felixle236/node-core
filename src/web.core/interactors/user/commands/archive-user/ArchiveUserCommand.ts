import { ICommand } from '../../../../domain/common/interactor/interfaces/ICommand';

export class ArchiveUserCommand implements ICommand {
    id: string;

    roleAuthLevel: number;
}
