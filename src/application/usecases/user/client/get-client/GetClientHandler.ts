import { IClientRepository } from 'application/interfaces/repositories/user/IClientRepository';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { GetClientDataOutput, GetClientOutput } from './GetClientSchema';

@Service()
export class GetClientHandler implements IUsecaseHandler<string, GetClientOutput> {
  constructor(@Inject(InjectRepository.Client) private readonly _clientRepository: IClientRepository) {}

  async handle(id: string): Promise<GetClientOutput> {
    const client = await this._clientRepository.get(id);
    if (!client) {
      throw new NotFoundError();
    }

    const data = new GetClientDataOutput();
    data.id = client.id;
    data.createdAt = client.createdAt;
    data.firstName = client.firstName;
    data.lastName = client.lastName;
    data.email = client.email;
    data.avatar = client.avatar;
    data.gender = client.gender;
    data.birthday = client.birthday;
    data.phone = client.phone;
    data.address = client.address;
    data.locale = client.locale;
    data.activedAt = client.activedAt;
    data.archivedAt = client.archivedAt;

    const result = new GetClientOutput();
    result.data = data;
    return result;
  }
}
