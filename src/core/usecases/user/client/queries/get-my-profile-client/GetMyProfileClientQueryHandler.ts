import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { SystemError } from '@shared/exceptions/SystemError';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { GetMyProfileClientQueryOutput } from './GetMyProfileClientQueryOutput';

@Service()
export class GetMyProfileClientQueryHandler extends QueryHandler<string, GetMyProfileClientQueryOutput> {
    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    async handle(id: string): Promise<GetMyProfileClientQueryOutput> {
        const client = await this._clientRepository.getById(id);
        if (!client)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        const result = new GetMyProfileClientQueryOutput();
        result.setData(client);
        return result;
    }
}
