import { IUserOnlineStatusRepository } from '@gateways/repositories/user/IUserOnlineStatusRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { UsecaseHandler } from '@shared/usecase/UsecaseHandler';
import { isUUID } from 'class-validator';
import { Inject, Service } from 'typedi';
import { GetListOnlineStatusByIdsInput } from './GetListOnlineStatusByIdsInput';
import { GetListOnlineStatusByIdsData, GetListOnlineStatusByIdsOutput } from './GetListOnlineStatusByIdsOutput';

@Service()
export class GetListOnlineStatusByIdsHandler extends UsecaseHandler<GetListOnlineStatusByIdsInput, GetListOnlineStatusByIdsOutput> {
    constructor(
        @Inject('user_online_status.repository') private readonly _userOnlineStatusRepository: IUserOnlineStatusRepository
    ) {
        super();
    }

    async handle(param: GetListOnlineStatusByIdsInput): Promise<GetListOnlineStatusByIdsOutput> {
        if (param.ids.some(id => !isUUID(id)))
            throw new SystemError(MessageError.PARAM_INVALID, 'ids');

        const ids = param.ids ?? [];
        const onlineStatuses = await this._userOnlineStatusRepository.getListOnlineStatusByIds(ids);
        const result = new GetListOnlineStatusByIdsOutput();
        result.data = ids.map((id, index) => {
            const onlineStatus: {isOnline: boolean, onlineAt: Date | null} = onlineStatuses[index] ? JSON.parse(onlineStatuses[index]) : { isOnline: false, onlineAt: null };
            const data = new GetListOnlineStatusByIdsData();
            data.id = id;
            data.isOnline = onlineStatus.isOnline;
            if (onlineStatus.onlineAt)
                data.onlineAt = onlineStatus.onlineAt;
            return data;
        });
        return result;
    }
}
