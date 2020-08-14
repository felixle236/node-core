import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put, QueryParams } from 'routing-controllers';
import { ArchiveUserInteractor } from '../../web.core/interactors/user/archive-user/Interactor';
import { BooleanResult } from '../../web.core/domain/common/outputs/BooleanResult';
import { CreateUserInput } from '../../web.core/interactors/user/create-user/Input';
import { CreateUserInteractor } from '../../web.core/interactors/user/create-user/Interactor';
import { DeleteUserInteractor } from '../../web.core/interactors/user/delete-user/Interactor';
import { FindUserFilter } from '../../web.core/interactors/user/find-user/Filter';
import { FindUserInteractor } from '../../web.core/interactors/user/find-user/Interactor';
import { FindUserOutput } from '../../web.core/interactors/user/find-user/Output';
import { GetUserByIdInteractor } from '../../web.core/interactors/user/get-user-by-id/Interactor';
import { GetUserByIdOutput } from '../../web.core/interactors/user/get-user-by-id/Output';
import { IdentityResult } from '../../web.core/domain/common/outputs/IdentityResult';
import { PaginationResult } from '../../web.core/domain/common/outputs/PaginationResult';
import { RoleId } from '../../web.core/domain/enums/RoleId';
import { Service } from 'typedi';
import { UpdateUserInput } from '../../web.core/interactors/user/update-user/Input';
import { UpdateUserInteractor } from '../../web.core/interactors/user/update-user/Interactor';
import { UserAuthenticated } from '../../web.core/domain/common/UserAuthenticated';

@Service()
@JsonController('/users')
export class UserController {
    constructor(
        private _findUserInteractor: FindUserInteractor,
        private _getUserByIdInteractor: GetUserByIdInteractor,
        private _createUserInteractor: CreateUserInteractor,
        private _updateUserInteractor: UpdateUserInteractor,
        private _archiveUserInteractor: ArchiveUserInteractor,
        private _deleteUserInteractor: DeleteUserInteractor
    ) {}

    @Get('/')
    @Authorized(RoleId.SUPER_ADMIN)
    async find(@QueryParams() filter: FindUserFilter, @CurrentUser() userAuth: UserAuthenticated): Promise<PaginationResult<FindUserOutput>> {
        return await this._findUserInteractor.handle(filter, userAuth);
    }

    @Get('/:id([0-9]+)')
    @Authorized(RoleId.SUPER_ADMIN)
    async getById(@Param('id') id: number, @CurrentUser() userAuth: UserAuthenticated): Promise<GetUserByIdOutput> {
        return await this._getUserByIdInteractor.handle(id, userAuth);
    }

    @Post('/')
    @Authorized(RoleId.SUPER_ADMIN)
    async create(@Body() data: CreateUserInput, @CurrentUser() userAuth: UserAuthenticated): Promise<IdentityResult<number>> {
        return await this._createUserInteractor.handle(data, userAuth);
    }

    @Put('/:id([0-9]+)')
    @Authorized(RoleId.SUPER_ADMIN)
    async update(@Param('id') id: number, @Body() data: UpdateUserInput, @CurrentUser() userAuth: UserAuthenticated): Promise<BooleanResult> {
        data.id = id;
        return await this._updateUserInteractor.handle(data, userAuth);
    }

    @Post('/:id([0-9]+)/archive')
    @Authorized(RoleId.SUPER_ADMIN)
    async archive(@Param('id') id: number, @CurrentUser() userAuth: UserAuthenticated): Promise<BooleanResult> {
        return await this._archiveUserInteractor.handle(id, userAuth);
    }

    @Delete('/:id([0-9]+)')
    @Authorized(RoleId.SUPER_ADMIN)
    async delete(@Param('id') id: number, @CurrentUser() userAuth: UserAuthenticated): Promise<BooleanResult> {
        return await this._deleteUserInteractor.handle(id, userAuth);
    }
}
