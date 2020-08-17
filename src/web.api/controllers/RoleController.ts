import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put, QueryParams } from 'routing-controllers';
import { BooleanResult } from '../../web.core/domain/common/outputs/BooleanResult';
import { CreateRoleInput } from '../../web.core/interactors/role/create-role/Input';
import { CreateRoleInteractor } from '../../web.core/interactors/role/create-role/Interactor';
import { DeleteRoleInteractor } from '../../web.core/interactors/role/delete-role/Interactor';
import { FindRoleCommonFilter } from '../../web.core/interactors/role/find-role-common/Filter';
import { FindRoleCommonInteractor } from '../../web.core/interactors/role/find-role-common/Interactor';
import { FindRoleCommonOutput } from '../../web.core/interactors/role/find-role-common/Output';
import { FindRoleFilter } from '../../web.core/interactors/role/find-role/Filter';
import { FindRoleInteractor } from '../../web.core/interactors/role/find-role/Interactor';
import { FindRoleOutput } from '../../web.core/interactors/role/find-role/Output';
import { GetRoleByIdInteractor } from '../../web.core/interactors/role/get-role-by-id/Interactor';
import { GetRoleByIdOutput } from '../../web.core/interactors/role/get-role-by-id/Output';
import { IdentityResult } from '../../web.core/domain/common/outputs/IdentityResult';
import { PaginationResult } from '../../web.core/domain/common/outputs/PaginationResult';
import { RoleId } from '../../web.core/domain/enums/RoleId';
import { Service } from 'typedi';
import { UpdateRoleInput } from '../../web.core/interactors/role/update-role/Input';
import { UpdateRoleInteractor } from '../../web.core/interactors/role/update-role/Interactor';
import { UserAuthenticated } from '../../web.core/domain/common/UserAuthenticated';

@Service()
@JsonController('/roles')
export class RoleController {
    constructor(
        private readonly _findRoleInteractor: FindRoleInteractor,
        private readonly _findRoleCommonInteractor: FindRoleCommonInteractor,
        private readonly _createRoleInteractor: CreateRoleInteractor,
        private readonly _getRoleByIdInteractor: GetRoleByIdInteractor,
        private readonly _updateRoleInteractor: UpdateRoleInteractor,
        private readonly _deleteRoleInteractor: DeleteRoleInteractor
    ) {}

    @Get('/')
    @Authorized(RoleId.SUPER_ADMIN)
    async find(@QueryParams() filter: FindRoleFilter, @CurrentUser() userAuth: UserAuthenticated): Promise<PaginationResult<FindRoleOutput>> {
        return await this._findRoleInteractor.handle(filter, userAuth);
    }

    @Get('/common')
    @Authorized(RoleId.SUPER_ADMIN)
    async findCommon(@QueryParams() filter: FindRoleCommonFilter, @CurrentUser() userAuth: UserAuthenticated): Promise<PaginationResult<FindRoleCommonOutput>> {
        return await this._findRoleCommonInteractor.handle(filter, userAuth);
    }

    @Get('/:id')
    @Authorized(RoleId.SUPER_ADMIN)
    async getById(@Param('id') id: string, @CurrentUser() userAuth: UserAuthenticated): Promise<GetRoleByIdOutput> {
        return await this._getRoleByIdInteractor.handle(id, userAuth);
    }

    @Post('/')
    @Authorized(RoleId.SUPER_ADMIN)
    async create(@Body() data: CreateRoleInput, @CurrentUser() userAuth: UserAuthenticated): Promise<IdentityResult<string>> {
        return await this._createRoleInteractor.handle(data, userAuth);
    }

    @Put('/:id')
    @Authorized(RoleId.SUPER_ADMIN)
    async update(@Param('id') id: string, @Body() data: UpdateRoleInput, @CurrentUser() userAuth: UserAuthenticated): Promise<BooleanResult> {
        data.id = id;
        return await this._updateRoleInteractor.handle(data, userAuth);
    }

    @Delete('/:id')
    @Authorized(RoleId.SUPER_ADMIN)
    async delete(@Param('id') id: string, @CurrentUser() userAuth: UserAuthenticated): Promise<BooleanResult> {
        return await this._deleteRoleInteractor.handle(id, userAuth);
    }
}
