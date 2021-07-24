import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { GetMyProfileManagerQueryOutput } from './GetMyProfileManagerQueryOutput';

@Service()
export class GetMyProfileManagerQueryHandler extends QueryHandler<string, GetMyProfileManagerQueryOutput> {
    @Inject('manager.repository')
    private readonly _managerRepository: IManagerRepository;

    async handle(id: string): Promise<GetMyProfileManagerQueryOutput> {
        const manager = await this._managerRepository.getById(id);
        if (!manager)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const result = new GetMyProfileManagerQueryOutput();
        result.setData(manager);
        return result;
    }
}
