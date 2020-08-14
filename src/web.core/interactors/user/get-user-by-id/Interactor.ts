import { Inject, Service } from 'typedi';
import { GetUserByIdOutput } from './Output';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IUserRepository } from '../../../gateways/repositories/IUserRepository';
import { SystemError } from '../../../domain/common/exceptions';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class GetUserByIdInteractor implements IInteractor<number, GetUserByIdOutput> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(id: number, userAuth: UserAuthenticated): Promise<GetUserByIdOutput> {
        const user = await this._userRepository.getById(id);
        if (!user || (userAuth && (!user.role || user.role.level <= userAuth.role.level)))
            throw new SystemError(4);

        return new GetUserByIdOutput(user);
    }
}
