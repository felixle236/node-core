import { IQuery } from '../../../../domain/common/interactor/interfaces/IQuery';

export class GetUserByIdQuery implements IQuery {
    id: string;

    roleAuthLevel: number;
}
