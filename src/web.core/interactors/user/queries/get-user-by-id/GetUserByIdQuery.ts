import { IQuery } from '../../../../domain/common/interactor/interfaces/IQuery';
import { RoleId } from '../../../../domain/enums/RoleId';

export class GetUserByIdQuery implements IQuery {
    id: string;

    roleAuthId: RoleId;
}
