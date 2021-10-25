import { Auth } from '@domain/entities/auth/Auth';
import { AuthType } from '@domain/enums/auth/AuthType';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { IUserRepository } from '@gateways/repositories/user/IUserRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { UsecaseHandler } from '@shared/usecase/UsecaseHandler';
import { UsecaseOption } from '@shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';
import { CreateAuthByEmailInput } from './CreateAuthByEmailInput';
import { CreateAuthByEmailOutput } from './CreateAuthByEmailOutput';

@Service()
export class CreateAuthByEmailHandler extends UsecaseHandler<CreateAuthByEmailInput, CreateAuthByEmailOutput> {
    constructor(
        @Inject('user.repository') private readonly _userRepository: IUserRepository,
        @Inject('auth.repository') private readonly _authRepository: IAuthRepository
    ) {
        super();
    }

    async handle(param: CreateAuthByEmailInput, usecaseOption: UsecaseOption): Promise<CreateAuthByEmailOutput> {
        const data = new Auth();
        data.type = AuthType.PersonalEmail;
        data.userId = param.userId;
        data.username = param.email;
        data.password = param.password;

        const user = await this._userRepository.get(param.userId, usecaseOption.queryRunner);
        if (!user)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, { t: 'user' });

        const auths = await this._authRepository.getAllByUser(param.userId, usecaseOption.queryRunner);
        if (auths && auths.find(auth => auth.type === AuthType.PersonalEmail))
            throw new SystemError(MessageError.PARAM_EXISTED, { t: 'data' });

        const result = new CreateAuthByEmailOutput();
        result.data = await this._authRepository.create(data, usecaseOption.queryRunner);
        return result;
    }
}
