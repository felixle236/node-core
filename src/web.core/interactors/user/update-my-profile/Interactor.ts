import { Inject, Service } from 'typedi';
import { BooleanResult } from '../../../domain/common/outputs/BooleanResult';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IUserRepository } from '../../../gateways/repositories/IUserRepository';
import { SystemError } from '../../../domain/common/exceptions';
import { UpdateMyProfileInput } from './Input';
import { User } from '../../../domain/entities/User';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class UpdateMyProfileInteractor implements IInteractor<UpdateMyProfileInput, BooleanResult> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(param: UpdateMyProfileInput, userAuth: UserAuthenticated): Promise<BooleanResult> {
        const id = userAuth.userId;
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

        const hasSucceed = await this._userRepository.update(id, data);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);
        return new BooleanResult(hasSucceed);
    }
}
