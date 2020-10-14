import { IQuery } from '../../../../domain/common/interactor/interfaces/IQuery';

export class GetRoleByIdQuery implements IQuery {
    id: string;
}
