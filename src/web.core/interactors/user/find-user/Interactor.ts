import { Inject, Service } from 'typedi';
import { FindUserFilter } from './Filter';
import { FindUserOutput } from './Output';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IUserRepository } from '../../../interfaces/repositories/IUserRepository';
import { ResultList } from '../../../domain/common/outputs/ResultList';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class FindUserInteractor implements IInteractor<FindUserFilter, ResultList<FindUserOutput>> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(filter: FindUserFilter, userAuth: UserAuthenticated): Promise<ResultList<FindUserOutput>> {
        filter.userAuth = userAuth;

        const [users, count] = await this._userRepository.findAndCount(filter);
        const list = users.map(user => new FindUserOutput(user));

        return new ResultList(list, count, filter.skip, filter.limit);
    }
}
