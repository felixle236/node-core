import { Inject, Service } from 'typedi';
import { GetUserByIdQuery } from './GetUserByIdQuery';
import { GetUserByIdResult } from './GetUserByIdResult';
import { IQueryHandler } from '../../../../domain/common/interactor/interfaces/IQueryHandler';
import { IUserRepository } from '../../../../gateways/repositories/user/IUserRepository';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { RoleId } from '../../../../domain/enums/RoleId';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';

@Service()
export class GetUserByIdQueryHandler implements IQueryHandler<GetUserByIdQuery, GetUserByIdResult> {
    @Inject('user.repository')
    private readonly _userRepository: IUserRepository;

    async handle(param: GetUserByIdQuery): Promise<GetUserByIdResult> {
        if (!param.id)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        if (!param.roleAuthId)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'permission');

        const user = await this._userRepository.getById(param.id);
        if (!user)
            throw new SystemError(MessageError.DATA_NOT_FOUND);

        if (!this._filterRolePermissions(param.roleAuthId, user.roleId).length)
            throw new SystemError(MessageError.ACCESS_DENIED);

        return new GetUserByIdResult(user);
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
