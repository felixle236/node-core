import { Auth } from '@domain/entities/auth/Auth';
import { AuthType } from '@domain/enums/auth/AuthType';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { IUserRepository } from '@gateways/repositories/user/IUserRepository';
import { IDbQueryRunner } from '@shared/database/interfaces/IDbQueryRunner';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { CreateAuthByEmailCommandInput } from './CreateAuthByEmailCommandInput';

@Service()
export class CreateAuthByEmailCommandHandler extends CommandHandler<CreateAuthByEmailCommandInput, string> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    @Inject('auth.repository')
    private readonly _authRepository: IAuthRepository;

    async handle(param: CreateAuthByEmailCommandInput, queryRunner?: IDbQueryRunner): Promise<string> {
        await validateDataInput(param);

        const data = new Auth();
        data.type = AuthType.PERSONAL_EMAIL;
        data.userId = param.userId;
        data.username = param.email;
        data.password = param.password;

        const user = await this._userRepository.getById(param.userId, queryRunner);
        if (!user)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'user');

        const auths = await this._authRepository.getAllByUser(param.userId, queryRunner);
        if (auths && auths.find(auth => auth.type === AuthType.PERSONAL_EMAIL))
            throw new SystemError(MessageError.PARAM_EXISTED, 'data');

        const id = await this._authRepository.create(data, queryRunner);
        return id;
    }
}
