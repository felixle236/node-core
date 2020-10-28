import { Authorized, Body, Delete, Get, JsonController, Param, Params, Post, Put, QueryParams } from 'routing-controllers';
import { CreateRoleCommand } from '../../../web.core/usecases/role/commands/create-role/CreateRoleCommand';
import { CreateRoleCommandHandler } from '../../../web.core/usecases/role/commands/create-role/CreateRoleCommandHandler';
import { DeleteRoleCommand } from '../../../web.core/usecases/role/commands/delete-role/DeleteRoleCommand';
import { DeleteRoleCommandHandler } from '../../../web.core/usecases/role/commands/delete-role/DeleteRoleCommandHandler';
import { FindRoleCommonQuery } from '../../../web.core/usecases/role/queries/find-role-common/FindRoleCommonQuery';
import { FindRoleCommonQueryHandler } from '../../../web.core/usecases/role/queries/find-role-common/FindRoleCommonQueryHandler';
import { FindRoleCommonResult } from '../../../web.core/usecases/role/queries/find-role-common/FindRoleCommonResult';
import { FindRoleQuery } from '../../../web.core/usecases/role/queries/find-role/FindRoleQuery';
import { FindRoleQueryHandler } from '../../../web.core/usecases/role/queries/find-role/FindRoleQueryHandler';
import { FindRoleResult } from '../../../web.core/usecases/role/queries/find-role/FindRoleResult';
import { GetRoleByIdQuery } from '../../../web.core/usecases/role/queries/get-role-by-id/GetRoleByIdQuery';
import { GetRoleByIdQueryHandler } from '../../../web.core/usecases/role/queries/get-role-by-id/GetRoleByIdQueryHandler';
import { GetRoleByIdResult } from '../../../web.core/usecases/role/queries/get-role-by-id/GetRoleByIdResult';
import { PaginationResult } from '../../../web.core/domain/common/usecase/PaginationResult';
import { RoleId } from '../../../web.core/domain/enums/role/RoleId';
import { Service } from 'typedi';
import { UpdateRoleCommand } from '../../../web.core/usecases/role/commands/update-role/UpdateRoleCommand';
import { UpdateRoleCommandHandler } from '../../../web.core/usecases/role/commands/update-role/UpdateRoleCommandHandler';

@Service()
@JsonController('/v1/roles')
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
    async find(@QueryParams() param: FindRoleQuery): Promise<PaginationResult<FindRoleResult>> {
        return await this._findRoleQueryHandler.handle(param);
    }

    @Get('/common')
    @Authorized(RoleId.SUPER_ADMIN)
    async findCommon(@QueryParams() param: FindRoleCommonQuery): Promise<PaginationResult<FindRoleCommonResult>> {
        return await this._findRoleCommonQueryHandler.handle(param);
    }

    @Get('/:id([0-9a-f-]{36})')
    @Authorized(RoleId.SUPER_ADMIN)
    async getById(@Params() param: GetRoleByIdQuery): Promise<GetRoleByIdResult> {
        return await this._getRoleByIdQueryHandler.handle(param);
    }

    @Post('/')
    @Authorized(RoleId.SUPER_ADMIN)
    async create(@Body() param: CreateRoleCommand): Promise<string> {
        return await this._createRoleCommandHandler.handle(param);
    }

    @Put('/:id([0-9a-f-]{36})')
    @Authorized(RoleId.SUPER_ADMIN)
    async update(@Param('id') id: string, @Body() param: UpdateRoleCommand): Promise<boolean> {
        param.id = id;
        return await this._updateRoleCommandHandler.handle(param);
    }

    @Delete('/:id([0-9a-f-]{36})')
    @Authorized(RoleId.SUPER_ADMIN)
    async delete(@Params() param: DeleteRoleCommand): Promise<boolean> {
        return await this._deleteRoleCommandHandler.handle(param);
    }
}
