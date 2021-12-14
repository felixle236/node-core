import { Auth } from 'domain/entities/auth/Auth';
import { AuthType } from 'domain/enums/auth/AuthType';
import { IAuthRepository } from 'application/interfaces/repositories/auth/IAuthRepository';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { UpdateMyPasswordByEmailInput } from './UpdateMyPasswordByEmailInput';
import { UpdateMyPasswordByEmailOutput } from './UpdateMyPasswordByEmailOutput';

@Service()
export class UpdateMyPasswordByEmailHandler implements IUsecaseHandler<UpdateMyPasswordByEmailInput, UpdateMyPasswordByEmailOutput> {
    constructor(
        @Inject(InjectRepository.Auth) private readonly _authRepository: IAuthRepository
    ) {}

    async handle(userId: string, param: UpdateMyPasswordByEmailInput): Promise<UpdateMyPasswordByEmailOutput> {
        const data = new Auth();
        Auth.validatePassword(param.password);
        data.password = Auth.hashPassword(param.password);

        const auths = await this._authRepository.getAllByUser(userId);
        const auth = auths.find(auth => auth.type === AuthType.PersonalEmail && Auth.hashPassword(param.oldPassword) === auth.password);
        if (!auth)
            throw new LogicalError(MessageError.PARAM_INCORRECT, { t: 'old_password' });

        const result = new UpdateMyPasswordByEmailOutput();
        result.data = await this._authRepository.update(auth.id, data);
        return result;
    }
}
