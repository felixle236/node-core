import { Inject, Service } from 'typedi';
import { ArchiveUserCommand } from './ArchiveUserCommand';
import { AccessDeniedError } from '../../../../domain/common/exceptions/AccessDeniedError';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { User } from '../../../../domain/entities/user/User';
import { RoleId } from '../../../../domain/enums/role/RoleId';
import { UserStatus } from '../../../../domain/enums/user/UserStatus';
import { IUserRepository } from '../../../../gateways/repositories/user/IUserRepository';

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
            throw new AccessDeniedError();

        const data = new User();
        data.status = UserStatus.ARCHIVED;
        data.archivedAt = new Date();

        const hasSucceed = await this._userRepository.update(param.id, data);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        return hasSucceed;
    }
}
