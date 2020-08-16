import { Inject, Service } from 'typedi';
import { FindContactFilter } from './Filter';
import { FindContactOutput } from './Output';
import { IContactStatusRepository } from '../../../gateways/repositories/IContactStatusRepository';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IUserRepository } from '../../../gateways/repositories/IUserRepository';
import { PaginationResult } from '../../../domain/common/outputs/PaginationResult';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class FindContactInteractor implements IInteractor<FindContactFilter, PaginationResult<FindContactOutput>> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    @Inject('contact.status.repository')
    private readonly _contactStatusRepository: IContactStatusRepository;

    async handle(filter: FindContactFilter, userAuth: UserAuthenticated): Promise<PaginationResult<FindContactOutput>> {
        filter.userAuth = userAuth;

        const [users, count] = await this._userRepository.findContactAndCount(filter);
        const list = users.map(user => new FindContactOutput(user));

        const onlineStatusList = await this._contactStatusRepository.getListOnlineStatus();
        const newMessageStatusList = await this._contactStatusRepository.getListNewMessageStatus(userAuth.userId);

        for (let i = 0; i < list.length; i++) {
            const item = list[i];

            if (onlineStatusList.indexOf(item.id) !== -1)
                item.isOnline = true;

            if (newMessageStatusList.indexOf(item.id) !== -1)
                item.hasNewMessage = true;
        }

        return new PaginationResult(list, count, filter.skip, filter.limit);
    }
}
