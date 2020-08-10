import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put, QueryParams } from 'routing-controllers';
import { CreateRoleInteractor, RoleCreate } from '../../web.core/interactors/role/CreateRoleInteractor';
import { FindRoleCommonInteractor, RoleCommonFilter, RoleCommonView } from '../../web.core/interactors/role/FindRoleCommonInteractor';
import { FindRoleInteractor, RoleFilter, RoleView } from '../../web.core/interactors/role/FindRoleInteractor';
import { GetRoleByIdInteractor, RoleDetailView } from '../../web.core/interactors/role/GetRoleByIdInteractor';
import { RoleUpdate, UpdateRoleInteractor } from '../../web.core/interactors/role/UpdateRoleInteractor';
import { DeleteRoleInteractor } from '../../web.core/interactors/role/DeleteRoleInteractor';
import { ResultList } from '../../web.core/domain/common/outputs/ResultList';
import { RoleId } from '../../web.core/domain/enums/RoleId';
import { Service } from 'typedi';
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
    async find(@QueryParams() filter: RoleFilter, @CurrentUser() userAuth: UserAuthenticated): Promise<ResultList<RoleView>> {
        return await this._findRoleInteractor.execute(filter, userAuth);
    }

    @Get('/common')
    @Authorized(RoleId.SUPER_ADMIN)
    async findCommon(@QueryParams() filter: RoleCommonFilter, @CurrentUser() userAuth: UserAuthenticated): Promise<ResultList<RoleCommonView>> {
        return await this._findRoleCommonInteractor.execute(filter, userAuth);
    }

    @Get('/:id([0-9]+)')
    @Authorized(RoleId.SUPER_ADMIN)
    async getById(@Param('id') id: number, @CurrentUser() userAuth: UserAuthenticated): Promise<RoleDetailView> {
        return await this._getRoleByIdInteractor.execute(id, userAuth);
    }

    @Post('/')
    @Authorized(RoleId.SUPER_ADMIN)
    async create(@Body() data: RoleCreate, @CurrentUser() userAuth: UserAuthenticated): Promise<number> {
        return await this._createRoleInteractor.execute(data, userAuth);
    }

    @Put('/:id([0-9]+)')
    @Authorized(RoleId.SUPER_ADMIN)
    async update(@Param('id') id: number, @Body() data: RoleUpdate, @CurrentUser() userAuth: UserAuthenticated): Promise<boolean> {
        data.id = id;
        return await this._updateRoleInteractor.execute(data, userAuth);
    }

    @Delete('/:id([0-9]+)')
    @Authorized(RoleId.SUPER_ADMIN)
    async delete(@Param('id') id: number, @CurrentUser() userAuth: UserAuthenticated): Promise<boolean> {
        return await this._deleteRoleInteractor.execute(id, userAuth);
    }
}
