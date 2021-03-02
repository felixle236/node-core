import { RoleId } from '../../../../domain/enums/role/RoleId';

export class DeleteManagerCommand {
    roleAuthId: RoleId;
    id: string;
}
