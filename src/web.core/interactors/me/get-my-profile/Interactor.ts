import { Inject, Service } from 'typedi';
import { GetMyProfileOutput } from './Output';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IUserRepository } from '../../../gateways/repositories/IUserRepository';
import { SystemError } from '../../../domain/common/exceptions';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class GetMyProfileInteractor implements IInteractor<UserAuthenticated, GetMyProfileOutput> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(userAuth: UserAuthenticated): Promise<GetMyProfileOutput> {
        const user = await this._userRepository.getById(userAuth.userId);
        if (!user)
            throw new SystemError(4);

        return new GetMyProfileOutput(user);
    }
}
