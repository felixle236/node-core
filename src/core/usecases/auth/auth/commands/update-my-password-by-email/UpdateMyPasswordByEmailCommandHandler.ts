import { Auth } from '@domain/entities/auth/Auth';
import { AuthType } from '@domain/enums/auth/AuthType';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { UpdateMyPasswordByEmailCommandInput } from './UpdateMyPasswordByEmailCommandInput';
import { UpdateMyPasswordByEmailCommandOutput } from './UpdateMyPasswordByEmailCommandOutput';

@Service()
export class UpdateMyPasswordByEmailCommandHandler extends CommandHandler<UpdateMyPasswordByEmailCommandInput, UpdateMyPasswordByEmailCommandOutput> {
    @Inject('auth.repository')
    private readonly _authRepository: IAuthRepository;

    async handle(userId: string, param: UpdateMyPasswordByEmailCommandInput): Promise<UpdateMyPasswordByEmailCommandOutput> {
        await validateDataInput(param);

        const data = new Auth();
        data.password = param.password;

        const auths = await this._authRepository.getAllByUser(userId);
        const auth = auths.find(auth => auth.type === AuthType.PERSONAL_EMAIL && auth.comparePassword(param.oldPassword));
        if (!auth)
            throw new SystemError(MessageError.PARAM_INCORRECT, 'old password');

        const hasSucceed = await this._authRepository.update(auth.id, data);
        const result = new UpdateMyPasswordByEmailCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
