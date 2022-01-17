import { IAuthRepository } from 'application/interfaces/repositories/auth/IAuthRepository';
import { IManagerRepository } from 'application/interfaces/repositories/user/IManagerRepository';
import { IDbContext } from 'shared/database/interfaces/IDbContext';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { InjectDb, InjectRepository } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { Inject, Service } from 'typedi';
import { DeleteManagerOutput } from './DeleteManagerSchema';

@Service()
export class DeleteManagerHandler implements IUsecaseHandler<string, DeleteManagerOutput> {
  constructor(
    @Inject(InjectDb.DbContext) private readonly _dbContext: IDbContext,
    @Inject(InjectRepository.Manager) private readonly _managerRepository: IManagerRepository,
    @Inject(InjectRepository.Auth) private readonly _authRepository: IAuthRepository,
  ) {}

  async handle(id: string): Promise<DeleteManagerOutput> {
    const manager = await this._managerRepository.get(id);
    if (!manager) {
      throw new NotFoundError();
    }

    return await this._dbContext.runTransaction(async (querySession) => {
      const result = new DeleteManagerOutput();
      result.data = await this._managerRepository.softDelete(id, querySession);

      const auths = await this._authRepository.getAllByUser(id, querySession);
      for (const auth of auths) {
        await this._authRepository.softDelete(auth.id, querySession);
      }

      return result;
    });
  }
}
