import { Inject, Service } from 'typedi';
import { ICommandHandler } from '../../../../domain/common/interactor/interfaces/ICommandHandler';
import { IUserStatusRepository } from '../../../../gateways/repositories/IUserStatusRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { UpdateUserOnlineStatusCommand } from './UpdateUserOnlineStatusCommand';

@Service()
export class UpdateUserOnlineStatusCommandHandler implements ICommandHandler<UpdateUserOnlineStatusCommand, boolean> {
    @Inject('user.status.repository')
    private readonly _userStatusRepository: IUserStatusRepository;

    async handle(param: UpdateUserOnlineStatusCommand): Promise<boolean> {
        if (!param.id)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        if (param.isOnline)
            return await this._userStatusRepository.addUserOnlineStatus(param.id);
        return await this._userStatusRepository.removeUserOnlineStatus(param.id);
    }
}
