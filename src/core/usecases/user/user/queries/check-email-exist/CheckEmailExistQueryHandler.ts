import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { Inject, Service } from 'typedi';
import { CheckEmailExistQueryOutput } from './CheckEmailExistQueryOutput';

@Service()
export class CheckEmailExistQueryHandler extends QueryHandler<string, CheckEmailExistQueryOutput> {
    @Inject('manager.repository')
    private readonly _managerRepository: IManagerRepository;

    @Inject('client.repository')
    private readonly _clientRepository: IClientRepository;

    async handle(email: string): Promise<CheckEmailExistQueryOutput> {
        const result = new CheckEmailExistQueryOutput();
        let isExist = await this._managerRepository.checkEmailExist(email);
        if (isExist) {
            result.setData(true);
            return result;
        }

        isExist = await this._clientRepository.checkEmailExist(email);
        if (isExist) {
            result.setData(true);
            return result;
        }

        result.setData(false);
        return result;
    }
}
