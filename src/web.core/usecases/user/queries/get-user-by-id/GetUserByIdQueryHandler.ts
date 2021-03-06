import { Inject, Service } from 'typedi';
import { GetUserByIdQuery } from './GetUserByIdQuery';
import { GetUserByIdQueryResult } from './GetUserByIdQueryResult';
import { AccessDeniedError } from '../../../../domain/common/exceptions/AccessDeniedError';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
import { IQueryHandler } from '../../../../domain/common/usecase/interfaces/IQueryHandler';
import { RoleId } from '../../../../domain/enums/role/RoleId';
import { IUserRepository } from '../../../../gateways/repositories/user/IUserRepository';

@Service()
export class GetUserByIdQueryHandler implements IQueryHandler<GetUserByIdQuery, GetUserByIdQueryResult> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(param: GetUserByIdQuery): Promise<GetUserByIdQueryResult> {
        if (!param.id)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        if (!param.roleAuthId)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'permission');

        const user = await this._userRepository.getById(param.id);
        if (!user)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        if (!this._filterRolePermissions(param.roleAuthId, user.roleId).length)
            throw new AccessDeniedError();

        return new GetUserByIdQueryResult(user);
    }

    private _filterRolePermissions(roleAuthId: RoleId, roleId: RoleId): RoleId[] {
        const limitRoleIds: RoleId[] = [];

        if (roleAuthId === RoleId.SUPER_ADMIN)
            limitRoleIds.push(RoleId.MANAGER, RoleId.CLIENT);
        else if (roleAuthId === RoleId.MANAGER)
            limitRoleIds.push(RoleId.CLIENT);

        return limitRoleIds.filter(limitRoleId => limitRoleId === roleId);
    }
}
