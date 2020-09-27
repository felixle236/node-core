import { ICommand } from '../../../../domain/common/interactor/interfaces/ICommand';
import { RoleId } from '../../../../domain/enums/RoleId';

export class ArchiveUserCommand implements ICommand {
    id: string;

    roleAuthId: RoleId;
}
