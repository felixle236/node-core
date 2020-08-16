import { Inject, Service } from 'typedi';
import { IAuthenticationService } from '../../../gateways/services/IAuthenticationService';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IUserRepository } from '../../../gateways/repositories/IUserRepository';
import { SigninInput } from './Input';
import { SigninOutput } from './Output';
import { SystemError } from '../../../domain/common/exceptions';
import { User } from '../../../domain/entities/User';
import { UserStatus } from '../../../domain/enums/UserStatus';

@Service()
export class SigninInteractor implements IInteractor<SigninInput, SigninOutput> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    @Inject('authentication.service')
    private readonly _authenticationService: IAuthenticationService;

    async handle(param: SigninInput): Promise<SigninOutput> {
        const data = new User();
        data.email = param.email;
        data.password = param.password;

        const user = await this._userRepository.getByUserPassword(data.email, data.password);
        if (!user)
            throw new SystemError(MessageError.PARAM_INCORRECT, 'email address or password');

        if (user.status !== UserStatus.ACTIVED)
            throw new SystemError(MessageError.PARAM_NOT_VERIFIED, 'account');

        const token = this._authenticationService.sign(user);
        return new SigninOutput(token);
    }
}
