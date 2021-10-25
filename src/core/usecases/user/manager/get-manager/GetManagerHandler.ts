import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { UsecaseHandler } from '@shared/usecase/UsecaseHandler';
import { Inject, Service } from 'typedi';
import { GetManagerData, GetManagerOutput } from './GetManagerOutput';

@Service()
export class GetManagerHandler extends UsecaseHandler<string, GetManagerOutput> {
    constructor(
        @Inject('manager.repository') private readonly _managerRepository: IManagerRepository
    ) {
        super();
    }

    async handle(id: string): Promise<GetManagerOutput> {
        const manager = await this._managerRepository.get(id);
        if (!manager)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const data = new GetManagerData();
        data.id = manager.id;
        data.createdAt = manager.createdAt;
        data.firstName = manager.firstName;
        if (manager.lastName)
            data.lastName = manager.lastName;
        data.email = manager.email;
        if (manager.avatar)
            data.avatar = manager.avatar;
        if (manager.archivedAt)
            data.archivedAt = manager.archivedAt;

        const result = new GetManagerOutput();
        result.data = data;
        return result;
    }
}
