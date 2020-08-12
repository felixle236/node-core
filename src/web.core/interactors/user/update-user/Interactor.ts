import { Inject, Service } from 'typedi';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IUserRepository } from '../../../interfaces/repositories/IUserRepository';
import { SystemError } from '../../../domain/common/exceptions';
import { UpdateUserInput } from './Input';
import { UpdateUserOutput } from './Output';
import { User } from '../../../domain/entities/User';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class UpdateUserInteractor implements IInteractor<UpdateUserInput, UpdateUserOutput> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(param: UpdateUserInput, userAuth: UserAuthenticated): Promise<UpdateUserOutput> {
        const id = param.id;
        const data = new User();
        data.firstName = param.firstName;
        data.lastName = param.lastName;
        data.gender = param.gender;

        if (param.birthday)
            data.birthday = new Date(param.birthday);

        data.phone = param.phone;
        data.address = param.address;
        data.currency = param.currency;
        data.culture = param.culture;

        const user = await this._userRepository.getById(id);
        if (!user)
            throw new SystemError(1004, 'user');

        if (!user.role || user.role.level <= userAuth.role.level)
            throw new SystemError(3);

        const hasSucceed = await this._userRepository.update(id, data);
        if (!hasSucceed)
            throw new SystemError(5);

        return new UpdateUserOutput(hasSucceed);
    }
}
