import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { UsecaseHandler } from '@shared/usecase/UsecaseHandler';
import { Inject, Service } from 'typedi';
import { GetMyProfileManagerData, GetMyProfileManagerOutput } from './GetMyProfileManagerOutput';

@Service()
export class GetMyProfileManagerHandler extends UsecaseHandler<string, GetMyProfileManagerOutput> {
    constructor(
        @Inject('manager.repository') private readonly _managerRepository: IManagerRepository
    ) {
        super();
    }

    async handle(id: string): Promise<GetMyProfileManagerOutput> {
        const manager = await this._managerRepository.get(id);
        if (!manager)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const data = new GetMyProfileManagerData();
        data.id = manager.id;
        data.createdAt = manager.createdAt;
        data.firstName = manager.firstName;
        if (manager.lastName)
            data.lastName = manager.lastName;
        data.email = manager.email;
        if (manager.avatar)
            data.avatar = manager.avatar;

        const result = new GetMyProfileManagerOutput();
        result.data = data;
        return result;
    }
}
