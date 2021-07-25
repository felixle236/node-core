import { IUserOnlineStatusRepository } from '@gateways/repositories/user/IUserOnlineStatusRepository';
import { validateDataInput } from '@libs/common';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { GetListOnlineStatusByIdsQueryInput } from './GetListOnlineStatusByIdsQueryInput';
import { GetListOnlineStatusByIdsQueryData, GetListOnlineStatusByIdsQueryOutput } from './GetListOnlineStatusByIdsQueryOutput';

@Service()
export class GetListOnlineStatusByIdsQueryHandler extends QueryHandler<GetListOnlineStatusByIdsQueryInput, GetListOnlineStatusByIdsQueryOutput> {
    @Inject('user_online_status.repository')
    private readonly _userOnlineStatusRepository: IUserOnlineStatusRepository;

    async handle(param: GetListOnlineStatusByIdsQueryInput): Promise<GetListOnlineStatusByIdsQueryOutput> {
        await validateDataInput(param);

        const ids = param.ids ?? [];
        const onlineStatuses = await this._userOnlineStatusRepository.getListOnlineStatusByIds(ids);
        const result = new GetListOnlineStatusByIdsQueryOutput();
        result.data = [];

        ids.forEach((id, index) => {
            const onlineStatus: {isOnline: boolean, onlineAt: Date | null} = onlineStatuses[index] ? JSON.parse(onlineStatuses[index]) : { isOnline: false, onlineAt: null };
            const data = new GetListOnlineStatusByIdsQueryData();
            data.id = id;
            data.isOnline = onlineStatus.isOnline;
            if (onlineStatus.onlineAt)
                data.onlineAt = onlineStatus.onlineAt;
            result.data.push(data);
        });
        return result;
    }
}
