import { Inject, Service } from 'typedi';
import { ArchiveUserCommand } from './ArchiveUserCommand';
import { ICommandHandler } from '../../../../domain/common/interactor/interfaces/ICommandHandler';
import { IUserRepository } from '../../../../gateways/repositories/IUserRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { User } from '../../../../domain/entities/User';
import { UserStatus } from '../../../../domain/enums/UserStatus';

@Service()
export class ArchiveUserCommandHandler implements ICommandHandler<ArchiveUserCommand, boolean> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(param: ArchiveUserCommand): Promise<boolean> {
        if (!param.id)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        if (!param.roleAuthLevel)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'role level');

        const user = await this._userRepository.getById(param.id);
        if (!user)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'user');

        if (!user.role || user.role.level <= param.roleAuthLevel)
            throw new SystemError(MessageError.ACCESS_DENIED);

        const data = new User();
        data.status = UserStatus.ARCHIVED;
        data.archivedAt = new Date();

        const hasSucceed = await this._userRepository.update(param.id, data);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        return hasSucceed;
    }
}
