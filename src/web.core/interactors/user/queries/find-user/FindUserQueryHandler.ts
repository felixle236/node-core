import { Inject, Service } from 'typedi';
import { FindUserQuery } from './FindUserQuery';
import { FindUserResult } from './FindUserResult';
import { IQueryHandler } from '../../../../domain/common/interactor/interfaces/IQueryHandler';
import { IUserRepository } from '../../../../gateways/repositories/IUserRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { PaginationResult } from '../../../../domain/common/interactor/PaginationResult';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';

@Service()
export class FindUserQueryHandler implements IQueryHandler<FindUserQuery, PaginationResult<FindUserResult>> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(param: FindUserQuery): Promise<PaginationResult<FindUserResult>> {
        if (!param.roleAuthLevel)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'permission');

        const [users, count] = await this._userRepository.findAndCount(param);
        const list = users.map(user => new FindUserResult(user));

        return new PaginationResult(list, count, param.skip, param.limit);
    }
}
