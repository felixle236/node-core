import { IQuery } from '../../../../domain/common/interactor/interfaces/IQuery';

export class GetListOnlineStatusByIdsQuery implements IQuery {
    ids: string[];
}
