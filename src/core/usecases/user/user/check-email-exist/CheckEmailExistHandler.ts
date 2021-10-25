import { IClientRepository } from '@gateways/repositories/user/IClientRepository';
import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { UsecaseHandler } from '@shared/usecase/UsecaseHandler';
import { Inject, Service } from 'typedi';
import { CheckEmailExistOutput } from './CheckEmailExistOutput';

@Service()
export class CheckEmailExistHandler extends UsecaseHandler<string, CheckEmailExistOutput> {
    constructor(
        @Inject('manager.repository') private readonly _managerRepository: IManagerRepository,
        @Inject('client.repository') private readonly _clientRepository: IClientRepository
    ) {
        super();
    }

    async handle(email: string): Promise<CheckEmailExistOutput> {
        const result = new CheckEmailExistOutput();
        let isExist = await this._managerRepository.checkEmailExist(email);
        if (isExist) {
            result.data = true;
            return result;
        }

        isExist = await this._clientRepository.checkEmailExist(email);
        if (isExist) {
            result.data = true;
            return result;
        }

        result.data = false;
        return result;
    }
}
