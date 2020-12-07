import { Inject, Service } from 'typedi';
import { GetListOnlineStatusByIdsQuery } from './GetListOnlineStatusByIdsQuery';
import { GetListOnlineStatusByIdsQueryResult } from './GetListOnlineStatusByIdsQueryResult';
import { IQueryHandler } from '../../../../domain/common/usecase/interfaces/IQueryHandler';
import { IUserOnlineStatusRepository } from '../../../../gateways/repositories/user/IUserOnlineStatusRepository';

@Service()
export class GetListOnlineStatusByIdsQueryHandler implements IQueryHandler<GetListOnlineStatusByIdsQuery, GetListOnlineStatusByIdsQueryResult[]> {
    @Inject('user.online.status.repository')
    private readonly _userOnlineStatusRepository: IUserOnlineStatusRepository;

    async handle(param: GetListOnlineStatusByIdsQuery): Promise<GetListOnlineStatusByIdsQueryResult[]> {
        const ids = param.ids ?? [];
        const onlineIds = await this._userOnlineStatusRepository.getListOnlineStatusByIds(ids);
        return ids.map(id => new GetListOnlineStatusByIdsQueryResult(id, onlineIds.indexOf(id) !== -1));
    }
}
