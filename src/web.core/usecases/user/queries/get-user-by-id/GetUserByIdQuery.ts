import { IQuery } from '../../../../domain/common/usecase/interfaces/IQuery';
import { RoleId } from '../../../../domain/enums/role/RoleId';

export class GetUserByIdQuery implements IQuery {
    id: string;

    roleAuthId: RoleId;
}
