import { Inject, Service } from 'typedi';
import { ArchiveUserCommand } from './ArchiveUserCommand';
import { ICommandHandler } from '../../../../domain/common/interactor/interfaces/ICommandHandler';
import { IUserRepository } from '../../../../gateways/repositories/user/IUserRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { RoleId } from '../../../../domain/enums/role/RoleId';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { User } from '../../../../domain/entities/user/User';
import { UserStatus } from '../../../../domain/enums/user/UserStatus';

@Service()
export class ArchiveUserCommandHandler implements ICommandHandler<ArchiveUserCommand, boolean> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(param: ArchiveUserCommand): Promise<boolean> {
        if (!param.id)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        if (!param.roleAuthId)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'permission');

        const user = await this._userRepository.getById(param.id);
        if (!user)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        if (!(param.roleAuthId === RoleId.SUPER_ADMIN || (param.roleAuthId === RoleId.MANAGER && [RoleId.CLIENT].includes(user.roleId))))
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
