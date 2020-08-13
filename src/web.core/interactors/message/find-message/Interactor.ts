import { Inject, Service } from 'typedi';
import { FindMessageFilter } from './Filter';
import { FindMessageOutput } from './Output';
import { IInteractor } from '../../../domain/common/IInteractor';
import { IMessageRepository } from '../../../interfaces/repositories/IMessageRepository';
import { PaginationResult } from '../../../domain/common/outputs/PaginationResult';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class FindMessageInteractor implements IInteractor<FindMessageFilter, PaginationResult<FindMessageOutput>> {
    @Inject('message.repository')
    private readonly _messageRepository: IMessageRepository;

    async handle(filter: FindMessageFilter, userAuth: UserAuthenticated): Promise<PaginationResult<FindMessageOutput>> {
        filter.userAuth = userAuth;

        const [messages, count] = await this._messageRepository.findAndCount(filter);
        const messageViews = messages.map(message => new FindMessageOutput(message));

        return new PaginationResult(messageViews, count, filter.skip, filter.limit);
    }
}
