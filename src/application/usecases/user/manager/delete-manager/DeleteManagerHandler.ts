import { IManagerRepository } from 'application/interfaces/repositories/user/IManagerRepository';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { DeleteManagerOutput } from './DeleteManagerOutput';

@Service()
export class DeleteManagerHandler implements IUsecaseHandler<string, DeleteManagerOutput> {
    constructor(
        @Inject(InjectRepository.Manager) private readonly _managerRepository: IManagerRepository
    ) {}

    async handle(id: string): Promise<DeleteManagerOutput> {
        const manager = await this._managerRepository.get(id);
        if (!manager)
            throw new NotFoundError();

        const result = new DeleteManagerOutput();
        result.data = await this._managerRepository.softDelete(id);
        return result;
    }
}
