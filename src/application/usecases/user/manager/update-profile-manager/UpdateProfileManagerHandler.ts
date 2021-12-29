import { Manager } from 'domain/entities/user/Manager';
import { IManagerRepository } from 'application/interfaces/repositories/user/IManagerRepository';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { UpdateProfileManagerInput } from './UpdateProfileManagerInput';
import { UpdateProfileManagerOutput } from './UpdateProfileManagerOutput';

@Service()
export class UpdateProfileManagerHandler implements IUsecaseHandler<UpdateProfileManagerInput, UpdateProfileManagerOutput> {
    constructor(
        @Inject(InjectRepository.Manager) private readonly _managerRepository: IManagerRepository
    ) {}

    async handle(id: string, param: UpdateProfileManagerInput): Promise<UpdateProfileManagerOutput> {
        const data = new Manager();
        data.firstName = param.firstName;
        data.lastName = param.lastName;
        data.gender = param.gender;
        data.birthday = param.birthday;

        const manager = await this._managerRepository.get(id);
        if (!manager)
            throw new NotFoundError();

        const result = new UpdateProfileManagerOutput();
        result.data = await this._managerRepository.update(id, data);
        return result;
    }
}
