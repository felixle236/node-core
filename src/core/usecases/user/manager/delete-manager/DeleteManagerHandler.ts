import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { UsecaseHandler } from '@shared/usecase/UsecaseHandler';
import { Inject, Service } from 'typedi';
import { DeleteManagerOutput } from './DeleteManagerOutput';

@Service()
export class DeleteManagerHandler extends UsecaseHandler<string, DeleteManagerOutput> {
    constructor(
        @Inject('manager.repository') private readonly _managerRepository: IManagerRepository
    ) {
        super();
    }

    async handle(id: string): Promise<DeleteManagerOutput> {
        const manager = await this._managerRepository.get(id);
        if (!manager)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const result = new DeleteManagerOutput();
        result.data = await this._managerRepository.softDelete(id);
        return result;
    }
}
