import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put, QueryParams } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { IUserBusiness } from '../../web.core/interfaces/businesses/IUserBusiness';
import { ResultListResponse } from '../../web.core/dtos/common/ResultListResponse';
import { UserAuthenticated } from '../../web.core/dtos/user/UserAuthenticated';
import { UserClaim } from '../../constants/claims/UserClaim';
import { UserCreateRequest } from '../../web.core/dtos/user/requests/UserCreateRequest';
import { UserFilterRequest } from '../../web.core/dtos/user/requests/UserFilterRequest';
import { UserLookupFilterRequest } from '../../web.core/dtos/user/requests/UserLookupFilterRequest';
import { UserLookupResponse } from '../../web.core/dtos/user/responses/UserLookupResponse';
import { UserResponse } from '../../web.core/dtos/user/responses/UserResponse';
import { UserUpdateRequest } from '../../web.core/dtos/user/requests/UserUpdateRequest';

@Service()
@JsonController('/users')
export class UserController {
    @Inject('user.business')
    private readonly userBusiness: IUserBusiness;

    @Get('/')
    @Authorized(UserClaim.GET)
    async find(@CurrentUser() userAuth: UserAuthenticated, @QueryParams() filter: UserFilterRequest): Promise<ResultListResponse<UserResponse>> {
        return await this.userBusiness.find(filter, userAuth);
    }

    @Get('/lookup')
    @Authorized(UserClaim.GET)
    async lookup(@CurrentUser() userAuth: UserAuthenticated, @QueryParams() filter: UserLookupFilterRequest): Promise<ResultListResponse<UserLookupResponse>> {
        return await this.userBusiness.lookup(filter, userAuth);
    }

    @Get('/:id([0-9]+)')
    @Authorized(UserClaim.GET)
    async getById(@CurrentUser() userAuth: UserAuthenticated, @Param('id') id: number): Promise<UserResponse | undefined> {
        return await this.userBusiness.getById(id, userAuth);
    }

    @Post('/')
    @Authorized(UserClaim.CREATE)
    async create(@CurrentUser() userAuth: UserAuthenticated, @Body() data: UserCreateRequest): Promise<UserResponse | undefined> {
        return await this.userBusiness.create(data, userAuth);
    }

    @Put('/:id([0-9]+)')
    @Authorized(UserClaim.UPDATE)
    async update(@CurrentUser() userAuth: UserAuthenticated, @Param('id') id: number, @Body() data: UserUpdateRequest): Promise<UserResponse | undefined> {
        return await this.userBusiness.update(id, data, userAuth);
    }

    @Delete('/:id([0-9]+)')
    @Authorized(UserClaim.DELETE)
    async delete(@CurrentUser() userAuth: UserAuthenticated, @Param('id') id: number): Promise<boolean> {
        return await this.userBusiness.delete(id, userAuth);
    }
}
