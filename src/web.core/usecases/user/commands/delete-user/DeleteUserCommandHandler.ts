import { Inject, Service } from 'typedi';
import { DeleteUserCommand } from './DeleteUserCommand';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { IUserRepository } from '../../../../gateways/repositories/user/IUserRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';

@Service()
export class DeleteUserCommandHandler implements ICommandHandler<DeleteUserCommand, boolean> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(param: DeleteUserCommand): Promise<boolean> {
        if (!param.id)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        const user = await this._userRepository.getById(param.id);
        if (!user)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const hasSucceed = await this._userRepository.delete(param.id);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        return hasSucceed;
    }
}
