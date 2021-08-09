import { Manager } from '@domain/entities/user/Manager';
import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { UpdateManagerCommandInput } from './UpdateManagerCommandInput';
import { UpdateManagerCommandOutput } from './UpdateManagerCommandOutput';

@Service()
export class UpdateManagerCommandHandler extends CommandHandler<UpdateManagerCommandInput, UpdateManagerCommandOutput> {
    @Inject('manager.repository')
    private readonly _managerRepository: IManagerRepository;

    async handle(id: string, param: UpdateManagerCommandInput): Promise<UpdateManagerCommandOutput> {
        await validateDataInput(param);

        const data = new Manager();
        data.firstName = param.firstName;
        data.lastName = param.lastName;
        data.gender = param.gender;
        data.birthday = param.birthday;

        const manager = await this._managerRepository.getById(id);
        if (!manager)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const hasSucceed = await this._managerRepository.update(id, data);
        const result = new UpdateManagerCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
