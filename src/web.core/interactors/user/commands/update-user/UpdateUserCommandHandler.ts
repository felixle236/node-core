import { Inject, Service } from 'typedi';
import { ICommandHandler } from '../../../../domain/common/interactor/interfaces/ICommandHandler';
import { IUserRepository } from '../../../../gateways/repositories/IUserRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { UpdateUserCommand } from './UpdateUserCommand';
import { User } from '../../../../domain/entities/User';

@Service()
export class UpdateUserCommandHandler implements ICommandHandler<UpdateUserCommand, boolean> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(param: UpdateUserCommand): Promise<boolean> {
        if (!param.id)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        if (!param.roleAuthLevel)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'role level');

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

        if (!user.role || user.role.level <= param.roleAuthLevel)
            throw new SystemError(MessageError.ACCESS_DENIED);

        const hasSucceed = await this._userRepository.update(id, data);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        return hasSucceed;
    }
}
