import { IAuthRepository } from 'application/interfaces/repositories/auth/IAuthRepository';
import { IClientRepository } from 'application/interfaces/repositories/user/IClientRepository';
import { IDbContext } from 'shared/database/interfaces/IDbContext';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { InjectDb, InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { DeleteClientOutput } from './DeleteClientOutput';

@Service()
export class DeleteClientHandler implements IUsecaseHandler<string, DeleteClientOutput> {
  constructor(
    @Inject(InjectDb.DbContext) private readonly _dbContext: IDbContext,
    @Inject(InjectRepository.Client) private readonly _clientRepository: IClientRepository,
    @Inject(InjectRepository.Auth) private readonly _authRepository: IAuthRepository,
  ) {}

  async handle(id: string): Promise<DeleteClientOutput> {
    const client = await this._clientRepository.get(id);
    if (!client) {
      throw new NotFoundError();
    }

    return await this._dbContext.runTransaction(async (querySession) => {
      const result = new DeleteClientOutput();
      result.data = await this._clientRepository.softDelete(id, querySession);

      const auths = await this._authRepository.getAllByUser(id, querySession);
      for (const auth of auths) {
        await this._authRepository.softDelete(auth.id, querySession);
      }

      return result;
    });
  }
}
