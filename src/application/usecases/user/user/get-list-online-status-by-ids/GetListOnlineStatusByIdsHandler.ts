import { IUserOnlineStatusRepository } from 'application/interfaces/repositories/user/IUserOnlineStatusRepository';
import { isUUID } from 'class-validator';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { GetListOnlineStatusByIdsInput } from './GetListOnlineStatusByIdsInput';
import { GetListOnlineStatusByIdsData, GetListOnlineStatusByIdsOutput } from './GetListOnlineStatusByIdsOutput';

@Service()
export class GetListOnlineStatusByIdsHandler implements IUsecaseHandler<GetListOnlineStatusByIdsInput, GetListOnlineStatusByIdsOutput> {
    constructor(
        @Inject(InjectRepository.UserOnlineStatus) private readonly _userOnlineStatusRepository: IUserOnlineStatusRepository
    ) {}

    async handle(param: GetListOnlineStatusByIdsInput): Promise<GetListOnlineStatusByIdsOutput> {
        if (param.ids.some(id => !isUUID(id)))
            throw new LogicalError(MessageError.PARAM_INVALID, 'ids');

        const ids = param.ids ?? [];
        const onlineStatuses = await this._userOnlineStatusRepository.getListOnlineStatusByIds(ids);
        const result = new GetListOnlineStatusByIdsOutput();
        result.data = ids.map((id, index) => {
            const onlineStatus: {isOnline: boolean, onlineAt?: Date} = onlineStatuses[index] ? JSON.parse(onlineStatuses[index]) : { isOnline: false, onlineAt: null };
            const data = new GetListOnlineStatusByIdsData();
            data.id = id;
            data.isOnline = onlineStatus.isOnline;
            data.onlineAt = onlineStatus.onlineAt;
            return data;
        });
        return result;
    }
}
