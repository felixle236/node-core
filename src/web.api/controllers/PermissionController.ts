import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { ClaimResponse } from '../../web.core/dtos/permission/responses/ClaimResponse';
import { IPermissionBusiness } from '../../web.core/interfaces/businesses/IPermissionBusiness';
import { PermissionClaim } from '../../constants/claims/PermissionClaim';
import { PermissionCreateRequest } from '../../web.core/dtos/permission/requests/PermissionCreateRequest';
import { PermissionResponse } from '../../web.core/dtos/permission/responses/PermissionResponse';
import { UserAuthenticated } from '../../web.core/dtos/user/UserAuthenticated';

@Service()
@JsonController('/permissions')
export class RoleController {
    @Inject('permission.business')
    private readonly permissionBusiness: IPermissionBusiness;

    @Get('/claims')
    @Authorized(PermissionClaim.GET)
    async getClaims(): Promise<ClaimResponse[]> {
        return await this.permissionBusiness.getClaims();
    }

    @Get('/roles/:roleId([0-9]+)')
    @Authorized(PermissionClaim.GET)
    async getAllByRole(@CurrentUser() userAuth: UserAuthenticated, @Param('roleId') roleId: number): Promise<PermissionResponse[]> {
        return await this.permissionBusiness.getAllByRole(roleId, userAuth);
    }

    @Get('/:id([0-9]+)')
    @Authorized(PermissionClaim.GET)
    async getById(@CurrentUser() userAuth: UserAuthenticated, @Param('id') id: number): Promise<PermissionResponse | undefined> {
        return await this.permissionBusiness.getById(id, userAuth);
    }

    @Post('/')
    @Authorized(PermissionClaim.CREATE)
    async create(@CurrentUser() userAuth: UserAuthenticated, @Body() data: PermissionCreateRequest): Promise<PermissionResponse | undefined> {
        return await this.permissionBusiness.create(data, userAuth);
    }

    @Delete('/:id([0-9]+)')
    @Authorized(PermissionClaim.DELETE)
    async delete(@CurrentUser() userAuth: UserAuthenticated, @Param('id') id: number): Promise<boolean> {
        return await this.permissionBusiness.delete(id, userAuth);
    }
}
