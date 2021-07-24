import { IUserOnlineStatusRepository } from '@gateways/repositories/user/IUserOnlineStatusRepository';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { UpdateUserOnlineStatusCommandInput } from './UpdateUserOnlineStatusCommandInput';
import { UpdateUserOnlineStatusCommandOutput } from './UpdateUserOnlineStatusCommandOutput';

@Service()
export class UpdateUserOnlineStatusCommandHandler extends CommandHandler<UpdateUserOnlineStatusCommandInput, UpdateUserOnlineStatusCommandOutput> {
    @Inject('user_online_status.repository')
    private readonly _userOnlineStatusRepository: IUserOnlineStatusRepository;

    async handle(id: string, param: UpdateUserOnlineStatusCommandInput): Promise<UpdateUserOnlineStatusCommandOutput> {
        const onlineStatus = {
            isOnline: param.isOnline,
            onlineAt: param.onlineAt
        };
        const hasSucceed = await this._userOnlineStatusRepository.updateUserOnlineStatus(id, JSON.stringify(onlineStatus));
        const result = new UpdateUserOnlineStatusCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
