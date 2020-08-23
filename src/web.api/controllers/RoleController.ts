import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Params, Post, Put, QueryParams } from 'routing-controllers';
import { CreateRoleCommand } from '../../web.core/interactors/role/commands/create-role/CreateRoleCommand';
import { CreateRoleCommandHandler } from '../../web.core/interactors/role/commands/create-role/CreateRoleCommandHandler';
import { DeleteRoleCommand } from '../../web.core/interactors/role/commands/delete-role/DeleteRoleCommand';
import { DeleteRoleCommandHandler } from '../../web.core/interactors/role/commands/delete-role/DeleteRoleCommandHandler';
import { FindRoleCommonQuery } from '../../web.core/interactors/role/queries/find-role-common/FindRoleCommonQuery';
import { FindRoleCommonQueryHandler } from '../../web.core/interactors/role/queries/find-role-common/FindRoleCommonQueryHandler';
import { FindRoleCommonResult } from '../../web.core/interactors/role/queries/find-role-common/FindRoleCommonResult';
import { FindRoleQuery } from '../../web.core/interactors/role/queries/find-role/FindRoleQuery';
import { FindRoleQueryHandler } from '../../web.core/interactors/role/queries/find-role/FindRoleQueryHandler';
import { FindRoleResult } from '../../web.core/interactors/role/queries/find-role/FindRoleResult';
import { GetRoleByIdQuery } from '../../web.core/interactors/role/queries/get-role-by-id/GetRoleByIdQuery';
import { GetRoleByIdQueryHandler } from '../../web.core/interactors/role/queries/get-role-by-id/GetRoleByIdQueryHandler';
import { GetRoleByIdResult } from '../../web.core/interactors/role/queries/get-role-by-id/GetRoleByIdResult';
import { PaginationResult } from '../../web.core/domain/common/interactor/PaginationResult';
import { RoleId } from '../../web.core/domain/enums/RoleId';
import { Service } from 'typedi';
import { UpdateRoleCommand } from '../../web.core/interactors/role/commands/update-role/UpdateRoleCommand';
import { UpdateRoleCommandHandler } from '../../web.core/interactors/role/commands/update-role/UpdateRoleCommandHandler';
import { UserAuthenticated } from '../../web.core/domain/common/UserAuthenticated';

@Service()
@JsonController('/roles')
export class RoleController {
    constructor(
        private readonly _findRoleQueryHandler: FindRoleQueryHandler,
        private readonly _findRoleCommonQueryHandler: FindRoleCommonQueryHandler,
        private readonly _getRoleByIdQueryHandler: GetRoleByIdQueryHandler,
        private readonly _createRoleCommandHandler: CreateRoleCommandHandler,
        private readonly _updateRoleCommandHandler: UpdateRoleCommandHandler,
        private readonly _deleteRoleCommandHandler: DeleteRoleCommandHandler
    ) {}

    @Get('/')
    @Authorized(RoleId.SUPER_ADMIN)
    async find(@QueryParams() param: FindRoleQuery, @CurrentUser() userAuth: UserAuthenticated): Promise<PaginationResult<FindRoleResult>> {
        param.roleAuthLevel = userAuth.role.level;
        return await this._findRoleQueryHandler.handle(param);
    }

    @Get('/common')
    @Authorized(RoleId.SUPER_ADMIN)
    async findCommon(@QueryParams() param: FindRoleCommonQuery, @CurrentUser() userAuth: UserAuthenticated): Promise<PaginationResult<FindRoleCommonResult>> {
        param.roleAuthLevel = userAuth.role.level;
        return await this._findRoleCommonQueryHandler.handle(param);
    }

    @Get('/:id')
    @Authorized(RoleId.SUPER_ADMIN)
    async getById(@Params() param: GetRoleByIdQuery, @CurrentUser() userAuth: UserAuthenticated): Promise<GetRoleByIdResult> {
        param.roleAuthLevel = userAuth.role.level;
        return await this._getRoleByIdQueryHandler.handle(param);
    }

    @Post('/')
    @Authorized(RoleId.SUPER_ADMIN)
    async create(@Body() param: CreateRoleCommand, @CurrentUser() userAuth: UserAuthenticated): Promise<string> {
        param.roleAuthLevel = userAuth.role.level;
        return await this._createRoleCommandHandler.handle(param);
    }

    @Put('/:id')
    @Authorized(RoleId.SUPER_ADMIN)
    async update(@Param('id') id: string, @Body() param: UpdateRoleCommand, @CurrentUser() userAuth: UserAuthenticated): Promise<boolean> {
        param.id = id;
        param.roleAuthLevel = userAuth.role.level;

        return await this._updateRoleCommandHandler.handle(param);
    }

    @Delete('/:id')
    @Authorized(RoleId.SUPER_ADMIN)
    async delete(@Params() param: DeleteRoleCommand, @CurrentUser() userAuth: UserAuthenticated): Promise<boolean> {
        param.roleAuthLevel = userAuth.role.level;
        return await this._deleteRoleCommandHandler.handle(param);
    }
}
