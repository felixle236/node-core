import { Manager } from '@domain/entities/user/Manager';
import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { UpdateMyProfileManagerCommandInput } from './UpdateMyProfileManagerCommandInput';
import { UpdateMyProfileManagerCommandOutput } from './UpdateMyProfileManagerCommandOutput';

@Service()
export class UpdateMyProfileManagerCommandHandler extends CommandHandler<UpdateMyProfileManagerCommandInput, UpdateMyProfileManagerCommandOutput> {
    @Inject('manager.repository')
    private readonly _managerRepository: IManagerRepository;

    async handle(id: string, param: UpdateMyProfileManagerCommandInput): Promise<UpdateMyProfileManagerCommandOutput> {
        const data = new Manager();
        data.firstName = param.firstName;
        data.lastName = param.lastName;

        const hasSucceed = await this._managerRepository.update(id, data);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        const result = new UpdateMyProfileManagerCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
