import { IClientRepository } from 'application/interfaces/repositories/user/IClientRepository';
import { InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { FindClientInput } from './FindClientInput';
import { FindClientData, FindClientOutput } from './FindClientOutput';

@Service()
export class FindClientHandler implements IUsecaseHandler<FindClientInput, FindClientOutput> {
  constructor(@Inject(InjectRepository.Client) private readonly _clientRepository: IClientRepository) {}

  async handle(param: FindClientInput): Promise<FindClientOutput> {
    const [clients, count] = await this._clientRepository.findAndCount({
      keyword: param.keyword,
      status: param.status,
      skip: param.skip,
      limit: param.limit,
    });

    const result = new FindClientOutput();
    result.setPagination(count, param.skip, param.limit);
    result.data = clients.map((client) => {
      const data = new FindClientData();
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
      return data;
    });
    return result;
  }
}
