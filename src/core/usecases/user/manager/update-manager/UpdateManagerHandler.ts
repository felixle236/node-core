import { Manager } from '@domain/entities/user/Manager';
import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { UsecaseHandler } from '@shared/usecase/UsecaseHandler';
import { Inject, Service } from 'typedi';
import { UpdateManagerInput } from './UpdateManagerInput';
import { UpdateManagerOutput } from './UpdateManagerOutput';

@Service()
export class UpdateManagerHandler extends UsecaseHandler<UpdateManagerInput, UpdateManagerOutput> {
    constructor(
        @Inject('manager.repository') private readonly _managerRepository: IManagerRepository
    ) {
        super();
    }

    async handle(id: string, param: UpdateManagerInput): Promise<UpdateManagerOutput> {
        const data = new Manager();
        data.firstName = param.firstName;
        data.lastName = param.lastName;
        data.gender = param.gender;
        data.birthday = param.birthday;

        const manager = await this._managerRepository.get(id);
        if (!manager)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const result = new UpdateManagerOutput();
        result.data = await this._managerRepository.update(id, data);
        return result;
    }
}
