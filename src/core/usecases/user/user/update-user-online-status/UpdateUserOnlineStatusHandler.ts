import { IUserOnlineStatusRepository } from '@gateways/repositories/user/IUserOnlineStatusRepository';
import { UsecaseHandler } from '@shared/usecase/UsecaseHandler';
import { Inject, Service } from 'typedi';
import { UpdateUserOnlineStatusInput } from './UpdateUserOnlineStatusInput';
import { UpdateUserOnlineStatusOutput } from './UpdateUserOnlineStatusOutput';

@Service()
export class UpdateUserOnlineStatusHandler extends UsecaseHandler<UpdateUserOnlineStatusInput, UpdateUserOnlineStatusOutput> {
    constructor(
        @Inject('user_online_status.repository') private readonly _userOnlineStatusRepository: IUserOnlineStatusRepository
    ) {
        super();
    }

    async handle(id: string, param: UpdateUserOnlineStatusInput): Promise<UpdateUserOnlineStatusOutput> {
        const onlineStatus = {
            isOnline: param.isOnline,
            onlineAt: param.onlineAt
        };
        const result = new UpdateUserOnlineStatusOutput();
        result.data = await this._userOnlineStatusRepository.updateUserOnlineStatus(id, JSON.stringify(onlineStatus));
        return result;
    }
}
