import { Inject, Service } from 'typedi';
import { ICommandHandler } from '../../../../domain/common/interactor/interfaces/ICommandHandler';
import { IUserOnlineStatusRepository } from '../../../../gateways/repositories/user/IUserOnlineStatusRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { UpdateUserOnlineStatusCommand } from './UpdateUserOnlineStatusCommand';

@Service()
export class UpdateUserOnlineStatusCommandHandler implements ICommandHandler<UpdateUserOnlineStatusCommand, boolean> {
    @Inject('user.online.status.repository')
    private readonly _userOnlineStatusRepository: IUserOnlineStatusRepository;

    async handle(param: UpdateUserOnlineStatusCommand): Promise<boolean> {
        if (!param.id)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        if (param.isOnline)
            return await this._userOnlineStatusRepository.addUserOnlineStatus(param.id);
        return await this._userOnlineStatusRepository.removeUserOnlineStatus(param.id);
    }
}
