import { Inject, Service } from 'typedi';
import { BooleanResult } from '../../../domain/common/outputs/BooleanResult';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IUserRepository } from '../../../interfaces/repositories/IUserRepository';
import { ResetPasswordInput } from './Input';
import { SystemError } from '../../../domain/common/exceptions';
import { User } from '../../../domain/entities/User';
import { UserStatus } from '../../../domain/enums/UserStatus';

@Service()
export class ResetPasswordInteractor implements IInteractor<ResetPasswordInput, BooleanResult> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(param: ResetPasswordInput): Promise<BooleanResult> {
        if (!param.forgotKey || !param.password)
            throw new SystemError();

        const user = await this._userRepository.getByForgotKey(param.forgotKey);
        if (!user)
            throw new SystemError(1004, 'forgot key');
        if (user.status !== UserStatus.ACTIVED)
            throw new SystemError();
        if (!user.forgotKey || !user.forgotExpire || user.forgotExpire < new Date())
            throw new SystemError(1008, 'forgot key');

        const data = new User();
        data.password = param.password;
        data.forgotKey = undefined;
        data.forgotExpire = undefined;

        const hasSucceed = await this._userRepository.update(user.id, data);
        if (!hasSucceed)
            throw new SystemError(5);

        return new BooleanResult(hasSucceed);
    }
}
