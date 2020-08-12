import { Inject, Service } from 'typedi';
import { DeleteUserOutput } from './Output';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IUserRepository } from '../../../interfaces/repositories/IUserRepository';
import { SystemError } from '../../../domain/common/exceptions';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class DeleteUserInteractor implements IInteractor<number, DeleteUserOutput> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(id: number, userAuth: UserAuthenticated): Promise<DeleteUserOutput> {
        const user = await this._userRepository.getById(id);
        if (!user)
            throw new SystemError(1004, 'user');

        if (!user.role || user.role.level <= userAuth.role.level)
            throw new SystemError(3);

        const hasSucceed = await this._userRepository.delete(id);
        if (!hasSucceed)
            throw new SystemError(5);

        return new DeleteUserOutput(hasSucceed);
    }
}
