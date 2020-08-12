import { Inject, Service } from 'typedi';
import { FindMemberFilter } from './Filter';
import { FindMemberOutput } from './Output';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IUserRepository } from '../../../interfaces/repositories/IUserRepository';
import { ResultList } from '../../../domain/common/outputs/ResultList';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class FindMemberInteractor implements IInteractor<FindMemberFilter, ResultList<FindMemberOutput>> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(filter: FindMemberFilter, userAuth: UserAuthenticated): Promise<ResultList<FindMemberOutput>> {
        filter.userAuth = userAuth;

        const [users, count] = await this._userRepository.findMemberAndCount(filter);
        const list = users.map(user => new FindMemberOutput(user));

        return new ResultList(list, count, filter.skip, filter.limit);
    }
}
