import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { GetManagerByIdQueryOutput } from './GetManagerByIdQueryOutput';

@Service()
export class GetManagerByIdQueryHandler extends QueryHandler<string, GetManagerByIdQueryOutput> {
    @Inject('manager.repository')
    private readonly _managerRepository: IManagerRepository;

    async handle(id: string): Promise<GetManagerByIdQueryOutput> {
        const manager = await this._managerRepository.getById(id);
        if (!manager)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const result = new GetManagerByIdQueryOutput();
        result.setData(manager);
        return result;
    }
}
