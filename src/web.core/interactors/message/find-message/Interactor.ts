import { Inject, Service } from 'typedi';
import { FindMessageFilter } from './Filter';
import { FindMessageOutput } from './Output';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IMessageRepository } from '../../../interfaces/repositories/IMessageRepository';
import { ResultList } from '../../../domain/common/outputs/ResultList';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class FindMessageInteractor implements IInteractor<FindMessageFilter, ResultList<FindMessageOutput>> {
    @Inject('message.repository')
    private readonly _messageRepository: IMessageRepository;

    async handle(filter: FindMessageFilter, userAuth: UserAuthenticated): Promise<ResultList<FindMessageOutput>> {
        filter.userAuth = userAuth;

        const [messages, count] = await this._messageRepository.findAndCount(filter);
        const messageViews = messages.map(message => new FindMessageOutput(message));

        return new ResultList(messageViews, count, filter.skip, filter.limit);
    }
}
