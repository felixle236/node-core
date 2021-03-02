import { RoleId } from '../../../../domain/enums/role/RoleId';

export class UpdateManagerCommand {
    roleAuthId: RoleId;
    id: string;
    firstName: string;
    lastName: string | null;
}
