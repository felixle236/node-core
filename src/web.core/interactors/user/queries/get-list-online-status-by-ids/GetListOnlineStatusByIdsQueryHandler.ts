import { Inject, Service } from 'typedi';
import { GetListOnlineStatusByIdsQuery } from './GetListOnlineStatusByIdsQuery';
import { GetListOnlineStatusByIdsResult } from './GetListOnlineStatusByIdsResult';
import { IQueryHandler } from '../../../../domain/common/interactor/interfaces/IQueryHandler';
import { IUserStatusRepository } from '../../../../gateways/repositories/IUserStatusRepository';

@Service()
export class GetListOnlineStatusByIdsQueryHandler implements IQueryHandler<GetListOnlineStatusByIdsQuery, GetListOnlineStatusByIdsResult[]> {
    @Inject('user.repository')
    private readonly _userStatusRepository: IUserStatusRepository;

    async handle(param: GetListOnlineStatusByIdsQuery): Promise<GetListOnlineStatusByIdsResult[]> {
        const onlineIds = await this._userStatusRepository.getListOnlineStatusByIds(param.ids);
        return param.ids.map(id => new GetListOnlineStatusByIdsResult(id, onlineIds.indexOf(id) !== -1));
    }
}