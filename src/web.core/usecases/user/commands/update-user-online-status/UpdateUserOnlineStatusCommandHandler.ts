import { Inject, Service } from 'typedi';
import { UpdateUserOnlineStatusCommand } from './UpdateUserOnlineStatusCommand';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { IUserOnlineStatusRepository } from '../../../../gateways/repositories/user/IUserOnlineStatusRepository';

@Service()
export class UpdateUserOnlineStatusCommandHandler implements ICommandHandler<UpdateUserOnlineStatusCommand, boolean> {
    @Inject('user_online_status.repository')
    private readonly _userOnlineStatusRepository: IUserOnlineStatusRepository;

    async handle(param: UpdateUserOnlineStatusCommand): Promise<boolean> {
        if (!param.id)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        const onlineStatus = {
            isOnline: param.isOnline,
            onlineAt: param.onlineAt
        };
        return await this._userOnlineStatusRepository.updateUserOnlineStatus(param.id, JSON.stringify(onlineStatus));
    }
}
