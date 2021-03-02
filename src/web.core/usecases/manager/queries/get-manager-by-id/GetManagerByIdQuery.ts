import { RoleId } from '../../../../domain/enums/role/RoleId';

export class GetManagerByIdQuery {
    roleAuthId: RoleId;
    id: string;
}
