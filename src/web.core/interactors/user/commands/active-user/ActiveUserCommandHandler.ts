import { Inject, Service } from 'typedi';
import { ActiveUserCommand } from './ActiveUserCommand';
import { ICommandHandler } from '../../../../domain/common/interactor/interfaces/ICommandHandler';
import { IUserRepository } from '../../../../gateways/repositories/IUserRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { User } from '../../../../domain/entities/User';
import { UserStatus } from '../../../../domain/enums/UserStatus';

@Service()
export class ActiveUserCommandHandler implements ICommandHandler<ActiveUserCommand, boolean> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(param: ActiveUserCommand): Promise<boolean> {
        if (!param.activeKey)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'activation key');

        const user = await this._userRepository.getByActiveKey(param.activeKey);
        if (!user)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'activation key');
        if (user.status === UserStatus.ACTIVED)
            throw new SystemError(MessageError.DATA_INVALID);
        if (!user.activeKey || !user.activeExpire || user.activeExpire < new Date())
            throw new SystemError(MessageError.PARAM_EXPIRED, 'activation key');

        const data = new User();
        data.status = UserStatus.ACTIVED;
        data.activeKey = '';
        data.activedAt = new Date();

        const hasSucceed = await this._userRepository.update(user.id, data);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        return hasSucceed;
    }
}
