import { RoleId } from '../../../../domain/enums/role/RoleId';

export class DeleteClientCommand {
    roleAuthId: RoleId;
    id: string;
}
