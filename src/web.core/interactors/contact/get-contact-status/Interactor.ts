import { Inject, Service } from 'typedi';
import { ArrayResult } from '../../../domain/common/outputs/ArrayResult';
import { GetContactStatusFilter } from './Filter';
import { GetContactStatusOutput } from './Output';
import { IContactStatusRepository } from '../../../interfaces/repositories/IContactStatusRepository';
import { IInteractor } from '../../../domain/common/IInteractor';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class GetContactStatusInteractor implements IInteractor<GetContactStatusFilter, ArrayResult<GetContactStatusOutput>> {
    @Inject('contact.status.repository')
    private readonly _contactStatusRepository: IContactStatusRepository;

    async handle(filter: GetContactStatusFilter, userAuth: UserAuthenticated): Promise<ArrayResult<GetContactStatusOutput>> {
        const onlineStatusList = await this._contactStatusRepository.getListOnlineStatus();
        const newMessageStatusList = await this._contactStatusRepository.getListNewMessageStatus(userAuth.userId);
        const list: GetContactStatusOutput[] = [];

        for (let i = 0; i < filter.ids.length; i++) {
            const output = new GetContactStatusOutput();
            output.id = filter.ids[i];

            if (onlineStatusList.indexOf(output.id) !== -1)
                output.isOnline = true;

            if (newMessageStatusList.indexOf(output.id) !== -1)
                output.hasNewMessage = true;

            list.push(output);
        }

        return new ArrayResult(list);
    }
}
