import { Inject, Service } from 'typedi';
import { GetMyProfileOutput } from './Output';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IUserRepository } from '../../../interfaces/repositories/IUserRepository';
import { SystemError } from '../../../domain/common/exceptions';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class GetMyProfileInteractor implements IInteractor<number, GetMyProfileOutput> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(id: number, userAuth: UserAuthenticated): Promise<GetMyProfileOutput> {
        const user = await this._userRepository.getById(id);
        if (!user || (userAuth && (!user.role || user.role.level <= userAuth.role.level)))
            throw new SystemError(4);

        return new GetMyProfileOutput(user);
    }
}
