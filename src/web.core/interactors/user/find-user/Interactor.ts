import { Inject, Service } from 'typedi';
import { FindUserFilter } from './Filter';
import { FindUserOutput } from './Output';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IUserRepository } from '../../../gateways/repositories/IUserRepository';
import { PaginationResult } from '../../../domain/common/outputs/PaginationResult';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class FindUserInteractor implements IInteractor<FindUserFilter, PaginationResult<FindUserOutput>> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(filter: FindUserFilter, userAuth: UserAuthenticated): Promise<PaginationResult<FindUserOutput>> {
        filter.userAuth = userAuth;

        const [users, count] = await this._userRepository.findAndCount(filter);
        const list = users.map(user => new FindUserOutput(user));

        return new PaginationResult(list, count, filter.skip, filter.limit);
    }
}
