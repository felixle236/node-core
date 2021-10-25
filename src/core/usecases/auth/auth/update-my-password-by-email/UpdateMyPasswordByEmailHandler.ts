import { Auth } from '@domain/entities/auth/Auth';
import { AuthType } from '@domain/enums/auth/AuthType';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { UsecaseHandler } from '@shared/usecase/UsecaseHandler';
import { Inject, Service } from 'typedi';
import { UpdateMyPasswordByEmailInput } from './UpdateMyPasswordByEmailInput';
import { UpdateMyPasswordByEmailOutput } from './UpdateMyPasswordByEmailOutput';

@Service()
export class UpdateMyPasswordByEmailHandler extends UsecaseHandler<UpdateMyPasswordByEmailInput, UpdateMyPasswordByEmailOutput> {
    constructor(
        @Inject('auth.repository') private readonly _authRepository: IAuthRepository
    ) {
        super();
    }

    async handle(userId: string, param: UpdateMyPasswordByEmailInput): Promise<UpdateMyPasswordByEmailOutput> {
        const data = new Auth();
        data.password = param.password;

        const auths = await this._authRepository.getAllByUser(userId);
        const auth = auths.find(auth => auth.type === AuthType.PersonalEmail && auth.comparePassword(param.oldPassword));
        if (!auth)
            throw new SystemError(MessageError.PARAM_INCORRECT, { t: 'old_password' });

        const result = new UpdateMyPasswordByEmailOutput();
        result.data = await this._authRepository.update(auth.id, data);
        return result;
    }
}
