import { RoleId } from '../../../../domain/enums/role/RoleId';

export class GetUserByIdQuery {
    roleAuthId: RoleId;
    id: string;
}
