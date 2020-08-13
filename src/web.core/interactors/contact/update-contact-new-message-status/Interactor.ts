import { Inject, Service } from 'typedi';
import { BooleanResult } from '../../../domain/common/outputs/BooleanResult';
import { IContactStatusRepository } from '../../../interfaces/repositories/IContactStatusRepository';
import { IInteractor } from '../../../domain/common/IInteractor';
import { SystemError } from '../../../domain/common/exceptions';
import { UserAuthenticated } from '../../../domain/common/UserAuthenticated';

@Service()
export class UpdateContactNewMessageStatusInteractor implements IInteractor<number, BooleanResult> {
    @Inject('contact.status.repository')
    private readonly _contactStatusRepository: IContactStatusRepository;

    async handle(room: number, userAuth: UserAuthenticated): Promise<BooleanResult> {
        if (room === undefined || room < 0)
            throw new SystemError(1002, 'room');

        const hasSucceed = await this._contactStatusRepository.removeNewMessageStatus(userAuth.userId, room);
        return new BooleanResult(hasSucceed);
    }
}
