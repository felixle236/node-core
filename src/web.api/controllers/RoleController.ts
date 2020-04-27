import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put, QueryParams } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { IRoleBusiness } from '../../web.core/interfaces/businesses/IRoleBusiness';
import { ResultListResponse } from '../../web.core/dtos/common/ResultListResponse';
import { RoleClaim } from '../../constants/claims/RoleClaim';
import { RoleCommonFilterRequest } from '../../web.core/dtos/role/requests/RoleCommonFilterRequest';
import { RoleCommonResponse } from '../../web.core/dtos/role/responses/RoleCommonResponse';
import { RoleCreateRequest } from '../../web.core/dtos/role/requests/RoleCreateRequest';
import { RoleFilterRequest } from '../../web.core/dtos/role/requests/RoleFilterRequest';
import { RoleResponse } from '../../web.core/dtos/role/responses/RoleResponse';
import { RoleUpdateRequest } from '../../web.core/dtos/role/requests/RoleUpdateRequest';
import { UserAuthenticated } from '../../web.core/dtos/user/UserAuthenticated';

@Service()
@JsonController('/roles')
export class RoleController {
    @Inject('role.business')
    private readonly roleBusiness: IRoleBusiness;

    @Get('/')
    @Authorized(RoleClaim.GET)
    async find(@CurrentUser() userAuth: UserAuthenticated, @QueryParams() filter: RoleFilterRequest): Promise<ResultListResponse<RoleResponse>> {
        return await this.roleBusiness.find(filter, userAuth);
    }

    @Get('/common')
    @Authorized(RoleClaim.GET)
    async findCommon(@CurrentUser() userAuth: UserAuthenticated, @QueryParams() filter: RoleCommonFilterRequest): Promise<ResultListResponse<RoleCommonResponse>> {
        return await this.roleBusiness.findCommon(filter, userAuth);
    }

    @Get('/:id([0-9]+)')
    @Authorized(RoleClaim.GET)
    async getById(@CurrentUser() userAuth: UserAuthenticated, @Param('id') id: number): Promise<RoleResponse | undefined> {
        return await this.roleBusiness.getById(id, userAuth);
    }

    @Post('/')
    @Authorized(RoleClaim.CREATE)
    async create(@CurrentUser() userAuth: UserAuthenticated, @Body() data: RoleCreateRequest): Promise<RoleResponse | undefined> {
        return await this.roleBusiness.create(data, userAuth);
    }

    @Put('/:id([0-9]+)')
    @Authorized(RoleClaim.UPDATE)
    async update(@CurrentUser() userAuth: UserAuthenticated, @Param('id') id: number, @Body() data: RoleUpdateRequest): Promise<RoleResponse | undefined> {
        return await this.roleBusiness.update(id, data, userAuth);
    }

    @Delete('/:id([0-9]+)')
    @Authorized(RoleClaim.DELETE)
    async delete(@CurrentUser() userAuth: UserAuthenticated, @Param('id') id: number): Promise<boolean> {
        return await this.roleBusiness.delete(id, userAuth);
    }
}
