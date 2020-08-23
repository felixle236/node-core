import { Inject, Service } from 'typedi';
import { ICommandHandler } from '../../../../domain/common/interactor/interfaces/ICommandHandler';
import { IUserRepository } from '../../../../gateways/repositories/IUserRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { UpdateMyPasswordCommand } from './UpdateMyPasswordCommand';
import { User } from '../../../../domain/entities/User';

@Service()
export class UpdateMyPasswordCommandHandler implements ICommandHandler<UpdateMyPasswordCommand, boolean> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(param: UpdateMyPasswordCommand): Promise<boolean> {
        if (!param.id)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        const data = new User();
        data.password = param.newPassword;

        const user = await this._userRepository.getById(param.id);
        if (!user || !user.comparePassword(param.password))
            throw new SystemError(MessageError.PARAM_INCORRECT, 'password');

        const hasSucceed = await this._userRepository.update(param.id, data);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);
        return hasSucceed;
    }
}
