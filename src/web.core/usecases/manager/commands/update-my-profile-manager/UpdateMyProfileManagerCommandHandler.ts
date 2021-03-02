import { Inject, Service } from 'typedi';
import { UpdateMyProfileManagerCommand } from './UpdateMyProfileManagerCommand';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { ICommandHandler } from '../../../../domain/common/usecase/interfaces/ICommandHandler';
import { Manager } from '../../../../domain/entities/manager/Manager';
import { IManagerRepository } from '../../../../gateways/repositories/manager/IManagerRepository';

@Service()
export class UpdateMyProfileManagerCommandHandler implements ICommandHandler<UpdateMyProfileManagerCommand, boolean> {
    @Inject('manager.repository')
    private readonly _managerRepository: IManagerRepository;

    async handle(param: UpdateMyProfileManagerCommand): Promise<boolean> {
        if (!param.userAuthId)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'permission');

        const data = new Manager();
        data.firstName = param.firstName;
        data.lastName = param.lastName;

        const hasSucceed = await this._managerRepository.update(param.userAuthId, data);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);
        return hasSucceed;
    }
}
