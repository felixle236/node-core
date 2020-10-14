import { IQuery } from '../../../../domain/common/usecase/interfaces/IQuery';

export class GetRoleByIdQuery implements IQuery {
    id: string;
}
