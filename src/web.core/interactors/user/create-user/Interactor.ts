import { Inject, Service } from 'typedi';
import { CreateUserInput } from './Input';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IRoleRepository } from '../../../gateways/repositories/IRoleRepository';
import { IUserRepository } from '../../../gateways/repositories/IUserRepository';
import { IdentityResult } from '../../../domain/common/outputs/IdentityResult';
import { SystemError } from '../../../domain/common/exceptions';
import { User } from '../../../domain/entities/User';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';
import { UserStatus } from '../../../domain/enums/UserStatus';

@Service()
export class CreateUserInteractor implements IInteractor<CreateUserInput, IdentityResult<number>> {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(param: CreateUserInput, userAuth: UserAuthenticated): Promise<IdentityResult<number>> {
        const data = new User();
        data.roleId = param.roleId;
        data.status = UserStatus.ACTIVED;
        data.firstName = param.firstName;
        data.lastName = param.lastName;
        data.email = param.email;
        data.password = param.password;
        data.gender = param.gender;

        if (param.birthday)
            data.birthday = new Date(param.birthday);

        data.phone = param.phone;
        data.address = param.address;
        data.culture = param.culture;
        data.currency = param.currency;

        if (await this._userRepository.checkEmailExist(data.email))
            throw new SystemError(1005, 'email');

        const role = await this._roleRepository.getById(data.roleId);
        if (!role)
            throw new SystemError(1002, 'role');

        if (role.level <= userAuth.role.level)
            throw new SystemError(3);

        const id = await this._userRepository.create(data);
        if (!id)
            throw new SystemError(5);
        return new IdentityResult(id);
    }
}
