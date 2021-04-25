import { Inject, Service } from 'typedi';
import { GetListOnlineStatusByIdsQuery } from './GetListOnlineStatusByIdsQuery';
import { GetListOnlineStatusByIdsQueryResult } from './GetListOnlineStatusByIdsQueryResult';
import { IQueryHandler } from '../../../../domain/common/usecase/interfaces/IQueryHandler';
import { IUserOnlineStatusRepository } from '../../../../gateways/repositories/user/IUserOnlineStatusRepository';

@Service()
export class GetListOnlineStatusByIdsQueryHandler implements IQueryHandler<GetListOnlineStatusByIdsQuery, GetListOnlineStatusByIdsQueryResult[]> {
    @Inject('user_online_status.repository')
    private readonly _userOnlineStatusRepository: IUserOnlineStatusRepository;

    async handle(param: GetListOnlineStatusByIdsQuery): Promise<GetListOnlineStatusByIdsQueryResult[]> {
        const ids = param.ids ?? [];
        const onlineStatuses = await this._userOnlineStatusRepository.getListOnlineStatusByIds(ids);

        return ids.map((id, index) => {
            const onlineStatus: {isOnline: boolean, onlineAt: Date | null} = onlineStatuses[index] ? JSON.parse(onlineStatuses[index]) : { isOnline: false, onlineAt: null };
            return new GetListOnlineStatusByIdsQueryResult(id, onlineStatus.isOnline, onlineStatus.onlineAt);
        });
    }
}
