import { IManagerRepository } from 'application/interfaces/repositories/user/IManagerRepository';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { GetMyProfileManagerData, GetMyProfileManagerOutput } from './GetMyProfileManagerOutput';

@Service()
export class GetMyProfileManagerHandler implements IUsecaseHandler<string, GetMyProfileManagerOutput> {
    constructor(
        @Inject(InjectRepository.Manager) private readonly _managerRepository: IManagerRepository
    ) {}

    async handle(id: string): Promise<GetMyProfileManagerOutput> {
        const manager = await this._managerRepository.get(id);
        if (!manager)
            throw new NotFoundError();

        const data = new GetMyProfileManagerData();
        data.id = manager.id;
        data.createdAt = manager.createdAt;
        data.firstName = manager.firstName;
        data.lastName = manager.lastName;
        data.email = manager.email;
        data.avatar = manager.avatar;

        const result = new GetMyProfileManagerOutput();
        result.data = data;
        return result;
    }
}
