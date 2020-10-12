import { ICommand } from '../../../../domain/common/interactor/interfaces/ICommand';
import { RoleId } from '../../../../domain/enums/role/RoleId';

export class ArchiveUserCommand implements ICommand {
    id: string;

    roleAuthId: RoleId;
}
