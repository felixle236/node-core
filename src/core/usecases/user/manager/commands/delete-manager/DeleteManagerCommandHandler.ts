import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { CommandHandler } from '@shared/usecase/CommandHandler';
import { Inject, Service } from 'typedi';
import { DeleteManagerCommandOutput } from './DeleteManagerCommandOutput';

@Service()
export class DeleteManagerCommandHandler extends CommandHandler<string, DeleteManagerCommandOutput> {
    @Inject('manager.repository')
    private readonly _managerRepository: IManagerRepository;

    async handle(id: string): Promise<DeleteManagerCommandOutput> {
        const manager = await this._managerRepository.getById(id);
        if (!manager)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const hasSucceed = await this._managerRepository.softDelete(id);
        if (!hasSucceed)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE);

        const result = new DeleteManagerCommandOutput();
        result.setData(hasSucceed);
        return result;
    }
}
