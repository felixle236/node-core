import * as validator from 'class-validator';
import { Inject, Service } from 'typedi';
import { ICommandHandler } from '../../../../domain/common/interactor/interfaces/ICommandHandler';
import { IUserRepository } from '../../../../gateways/repositories/user/IUserRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { ResetPasswordCommand } from './ResetPasswordCommand';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { User } from '../../../../domain/entities/user/User';
import { UserStatus } from '../../../../domain/enums/UserStatus';

@Service()
export class ResetPasswordCommandHandler implements ICommandHandler<ResetPasswordCommand, boolean> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(param: ResetPasswordCommand): Promise<boolean> {
        if (!param.email)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'email');

        if (!validator.isEmail(param.email))
            throw new SystemError(MessageError.PARAM_INVALID, 'email');

        if (!param.forgotKey)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'forgot key');

        if (!param.password)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'password');

        const user = await this._userRepository.getByEmail(param.email);
        if (!user || user.forgotKey !== param.forgotKey || user.status !== UserStatus.ACTIVED)
            throw new SystemError(MessageError.DATA_INVALID);

        if (!user.forgotExpire || user.forgotExpire < new Date())
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
