import { Inject, Service } from 'typedi';
import { ICommandHandler } from '../../../../domain/common/interactor/interfaces/ICommandHandler';
import { IUserRepository } from '../../../../gateways/repositories/IUserRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { ResetPasswordCommand } from './ResetPasswordCommand';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { User } from '../../../../domain/entities/User';
import { UserStatus } from '../../../../domain/enums/UserStatus';

@Service()
export class ResetPasswordCommandHandler implements ICommandHandler<ResetPasswordCommand, boolean> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(param: ResetPasswordCommand): Promise<boolean> {
        if (!param.forgotKey || !param.password)
            throw new SystemError(MessageError.DATA_INVALID);

        const user = await this._userRepository.getByForgotKey(param.forgotKey);
        if (!user)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'forgot key');
        if (user.status !== UserStatus.ACTIVED)
            throw new SystemError(MessageError.DATA_INVALID);
        if (!user.forgotKey || !user.forgotExpire || user.forgotExpire < new Date())
            throw new SystemError(MessageError.PARAM_EXPIRED, 'forgot key');

        const data = new User();
        data.password = param.password;
        data.forgotKey = '';

        const hasSucceed = await this._userRepository.update(user.id, data);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        return hasSucceed;
    }
}
