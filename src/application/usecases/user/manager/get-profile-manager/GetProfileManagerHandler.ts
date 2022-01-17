import { IManagerRepository } from 'application/interfaces/repositories/user/IManagerRepository';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { GetProfileManagerDataOutput, GetProfileManagerOutput } from './GetProfileManagerSchema';

@Service()
export class GetProfileManagerHandler implements IUsecaseHandler<string, GetProfileManagerOutput> {
  constructor(@Inject(InjectRepository.Manager) private readonly _managerRepository: IManagerRepository) {}

  async handle(id: string): Promise<GetProfileManagerOutput> {
    const manager = await this._managerRepository.get(id);
    if (!manager) {
      throw new NotFoundError();
    }

    const data = new GetProfileManagerDataOutput();
    data.id = manager.id;
    data.createdAt = manager.createdAt;
    data.firstName = manager.firstName;
    data.lastName = manager.lastName;
    data.email = manager.email;
    data.avatar = manager.avatar;

    const result = new GetProfileManagerOutput();
    result.data = data;
    return result;
  }
}
