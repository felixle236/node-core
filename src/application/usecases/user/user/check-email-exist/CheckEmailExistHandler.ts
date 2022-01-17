import { IClientRepository } from 'application/interfaces/repositories/user/IClientRepository';
import { IManagerRepository } from 'application/interfaces/repositories/user/IManagerRepository';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { CheckEmailExistOutput } from './CheckEmailExistOutput';

@Service()
export class CheckEmailExistHandler implements IUsecaseHandler<string, CheckEmailExistOutput> {
  constructor(
    @Inject(InjectRepository.Manager) private readonly _managerRepository: IManagerRepository,
    @Inject(InjectRepository.Client) private readonly _clientRepository: IClientRepository,
  ) {}

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
