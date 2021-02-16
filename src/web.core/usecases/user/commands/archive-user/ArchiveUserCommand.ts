import { RoleId } from '../../../../domain/enums/role/RoleId';

export class ArchiveUserCommand {
    roleAuthId: RoleId;
    id: string;
}
