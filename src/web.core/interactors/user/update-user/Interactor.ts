import { Inject, Service } from 'typedi';
import { BooleanResult } from '../../../domain/common/outputs/BooleanResult';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IUserRepository } from '../../../gateways/repositories/IUserRepository';
import { MessageError } from '../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../domain/common/exceptions/SystemError';
import { UpdateUserInput } from './Input';
import { User } from '../../../domain/entities/User';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class UpdateUserInteractor implements IInteractor<UpdateUserInput, BooleanResult> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(param: UpdateUserInput, userAuth: UserAuthenticated): Promise<BooleanResult> {
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
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'user');

        if (!user.role || user.role.level <= userAuth.role.level)
            throw new SystemError(MessageError.ACCESS_DENIED);

        const hasSucceed = await this._userRepository.update(id, data);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        return new BooleanResult(hasSucceed);
    }
}
