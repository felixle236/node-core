import { IManagerRepository } from 'application/interfaces/repositories/user/IManagerRepository';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { GetManagerData, GetManagerOutput } from './GetManagerOutput';

@Service()
export class GetManagerHandler implements IUsecaseHandler<string, GetManagerOutput> {
  constructor(@Inject(InjectRepository.Manager) private readonly _managerRepository: IManagerRepository) {}

  async handle(id: string): Promise<GetManagerOutput> {
    const manager = await this._managerRepository.get(id);
    if (!manager) {
      throw new NotFoundError();
    }

    const data = new GetManagerData();
    data.id = manager.id;
    data.createdAt = manager.createdAt;
    data.firstName = manager.firstName;
    data.lastName = manager.lastName;
    data.email = manager.email;
    data.avatar = manager.avatar;
    data.archivedAt = manager.archivedAt;

    const result = new GetManagerOutput();
    result.data = data;
    return result;
  }
}
