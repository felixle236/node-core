import { Inject, Service } from 'typedi';
import { UpdateMyProfileCommand } from './UpdateMyProfileCommand';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { User } from '../../../../domain/entities/user/User';
import { IUserRepository } from '../../../../gateways/repositories/user/IUserRepository';

@Service()
export class UpdateMyProfileCommandHandler implements ICommandHandler<UpdateMyProfileCommand, boolean> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(param: UpdateMyProfileCommand): Promise<boolean> {
        if (!param.userAuthId)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'permission');

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

        const hasSucceed = await this._userRepository.update(param.userAuthId, data);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);
        return hasSucceed;
    }
}
