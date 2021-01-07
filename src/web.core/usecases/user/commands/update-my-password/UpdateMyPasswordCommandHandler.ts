import { Inject, Service } from 'typedi';
import { UpdateMyPasswordCommand } from './UpdateMyPasswordCommand';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { User } from '../../../../domain/entities/user/User';
import { IUserRepository } from '../../../../gateways/repositories/user/IUserRepository';

@Service()
export class UpdateMyPasswordCommandHandler implements ICommandHandler<UpdateMyPasswordCommand, boolean> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(param: UpdateMyPasswordCommand): Promise<boolean> {
        if (!param.userAuthId)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'permission');

        const data = new User();
        data.password = param.password;

        const user = await this._userRepository.getById(param.userAuthId);
        if (!user || !user.comparePassword(param.oldPassword))
            throw new SystemError(MessageError.PARAM_INCORRECT, 'old password');

        const hasSucceed = await this._userRepository.update(param.userAuthId, data);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);
        return hasSucceed;
    }
}
