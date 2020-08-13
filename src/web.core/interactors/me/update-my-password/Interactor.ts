import { Inject, Service } from 'typedi';
import { BooleanResult } from '../../../domain/common/outputs/BooleanResult';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IUserRepository } from '../../../interfaces/repositories/IUserRepository';
import { SystemError } from '../../../domain/common/exceptions';
import { UpdateMyPasswordInput } from './Input';
import { User } from '../../../domain/entities/User';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class UpdateMyPasswordInteractor implements IInteractor<UpdateMyPasswordInput, BooleanResult> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(param: UpdateMyPasswordInput, userAuth: UserAuthenticated): Promise<BooleanResult> {
        const id = userAuth.userId;
        const data = new User();
        data.password = param.newPassword;

        const user = await this._userRepository.getById(id);
        if (!user || !user.comparePassword(param.password))
            throw new SystemError(1003, 'password');

        const hasSucceed = await this._userRepository.update(id, data);
        if (!hasSucceed)
            throw new SystemError(5);
        return new BooleanResult(hasSucceed);
    }
}
