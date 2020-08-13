import { Inject, Service } from 'typedi';
import { FindContactFilter } from './Filter';
import { FindContactOutput } from './Output';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IUserRepository } from '../../../interfaces/repositories/IUserRepository';
import { PaginationResult } from '../../../domain/common/outputs/PaginationResult';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class FindContactInteractor implements IInteractor<FindContactFilter, PaginationResult<FindContactOutput>> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(filter: FindContactFilter, userAuth: UserAuthenticated): Promise<PaginationResult<FindContactOutput>> {
        filter.userAuth = userAuth;

        const [users, count] = await this._userRepository.findContactAndCount(filter);
        const list = users.map(user => new FindContactOutput(user));

        return new PaginationResult(list, count, filter.skip, filter.limit);
    }
}
