import { Inject, Service } from 'typedi';
import { UpdateMyPasswordByEmailCommand } from './UpdateMyPasswordByEmailCommand';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { Auth } from '../../../../domain/entities/auth/Auth';
import { AuthType } from '../../../../domain/enums/auth/AuthType';
import { IAuthRepository } from '../../../../gateways/repositories/auth/IAuthRepository';

@Service()
export class UpdateMyPasswordByEmailCommandHandler implements ICommandHandler<UpdateMyPasswordByEmailCommand, boolean> {
    @Inject('auth.repository')
    private readonly _authRepository: IAuthRepository;

    async handle(param: UpdateMyPasswordByEmailCommand): Promise<boolean> {
        if (!param.userAuthId)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'permission');

        const data = new Auth();
        data.password = param.password;

        const auths = await this._authRepository.getAllByUser(param.userAuthId);
        const auth = auths.find(auth => auth.type === AuthType.PERSONAL_EMAIL && auth.comparePassword(param.oldPassword));
        if (!auth)
            throw new SystemError(MessageError.PARAM_INCORRECT, 'old password');

        const hasSucceed = await this._authRepository.update(auth.id, data);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);
        return hasSucceed;
    }
}
