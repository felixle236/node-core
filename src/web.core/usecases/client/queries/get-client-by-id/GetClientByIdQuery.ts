import { RoleId } from '../../../../domain/enums/role/RoleId';

export class GetClientByIdQuery {
    roleAuthId: RoleId;
    id: string;
}
