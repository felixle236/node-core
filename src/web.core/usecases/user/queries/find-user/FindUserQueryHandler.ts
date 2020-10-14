import { Inject, Service } from 'typedi';
import { AccessDeniedError } from '../../../../domain/common/exceptions/AccessDeniedError';
import { FindUserQuery } from './FindUserQuery';
import { FindUserResult } from './FindUserResult';
import { IQueryHandler } from '../../../../domain/common/usecase/interfaces/IQueryHandler';
import { IUserRepository } from '../../../../gateways/repositories/user/IUserRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { PaginationResult } from '../../../../domain/common/usecase/PaginationResult';
import { RoleId } from '../../../../domain/enums/role/RoleId';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';

@Service()
export class FindUserQueryHandler implements IQueryHandler<FindUserQuery, PaginationResult<FindUserResult>> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(param: FindUserQuery): Promise<PaginationResult<FindUserResult>> {
        if (!param.roleAuthId)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'permission');

        param.roleIds = this._filterRolePermissions(param.roleAuthId, param.roleIds);
        if (!param.roleIds.length)
            throw new AccessDeniedError();

        const [users, count] = await this._userRepository.findAndCount(param);
        const list = users.map(user => new FindUserResult(user));

        return new PaginationResult(list, count, param.skip, param.limit);
    }

    private _filterRolePermissions(roleAuthId: RoleId, roleIds?: RoleId[]): RoleId[] {
        const limitRoleIds: RoleId[] = [];

        if (roleAuthId === RoleId.SUPER_ADMIN)
            limitRoleIds.push(RoleId.MANAGER, RoleId.CLIENT);
        else if (roleAuthId === RoleId.MANAGER)
            limitRoleIds.push(RoleId.CLIENT);

        if (!roleIds || !roleIds.length)
            return limitRoleIds;
        return roleIds.filter(roleId => limitRoleIds.includes(roleId));
    }
}
