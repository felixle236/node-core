import { Inject, Service } from 'typedi';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IUserRepository } from '../../../interfaces/repositories/IUserRepository';
import { SystemError } from '../../../domain/common/exceptions';
import { UpdateMyPasswordInput } from './Input';
import { UpdateMyPasswordOutput } from './Output';
import { User } from '../../../domain/entities/User';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class UpdateMyPasswordInteractor implements IInteractor<UpdateMyPasswordInput, UpdateMyPasswordOutput> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(param: UpdateMyPasswordInput, userAuth: UserAuthenticated): Promise<UpdateMyPasswordOutput> {
        const id = userAuth.userId;
        const data = new User();
        data.password = param.newPassword;

        const user = await this._userRepository.getById(id);
        if (!user || !user.comparePassword(param.password))
            throw new SystemError(1003, 'password');

        const hasSucceed = await this._userRepository.update(id, data);
        if (!hasSucceed)
            throw new SystemError(5);
        return new UpdateMyPasswordOutput(hasSucceed);
    }
}
