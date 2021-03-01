import { Inject, Service } from 'typedi';
import { CreateAuthByEmailCommand } from './CreateAuthByEmailCommand';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { Auth } from '../../../../domain/entities/auth/Auth';
import { AuthType } from '../../../../domain/enums/auth/AuthType';
import { IAuthRepository } from '../../../../gateways/repositories/auth/IAuthRepository';
import { IUserRepository } from '../../../../gateways/repositories/user/IUserRepository';

@Service()
export class CreateAuthByEmailCommandHandler implements ICommandHandler<CreateAuthByEmailCommand, string> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    @Inject('auth.repository')
    private readonly _authRepository: IAuthRepository;

    async handle(param: CreateAuthByEmailCommand): Promise<string> {
        const data = new Auth();
        data.userId = param.userId;
        data.type = AuthType.PERSONAL_EMAIL;
        data.username = param.username;
        data.password = param.password;

        const user = await this._userRepository.getById(param.userId);
        if (!user)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'user');

        const auths = await this._authRepository.getAllByUser(param.userId);
        if (auths && auths.find(auth => auth.type === AuthType.PERSONAL_EMAIL))
            throw new SystemError(MessageError.PARAM_EXISTED, 'data');

        const id = await this._authRepository.create(data);
        if (!id)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);
        return id;
    }
}
