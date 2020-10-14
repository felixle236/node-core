import { IQuery } from '../../../../domain/common/usecase/interfaces/IQuery';

export class GetListOnlineStatusByIdsQuery implements IQuery {
    ids: string[];
}
