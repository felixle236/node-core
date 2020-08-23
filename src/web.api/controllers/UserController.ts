import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Params, Post, Put, QueryParams } from 'routing-controllers';
import { ArchiveUserCommand } from '../../web.core/interactors/user/commands/archive-user/ArchiveUserCommand';
import { ArchiveUserCommandHandler } from '../../web.core/interactors/user/commands/archive-user/ArchiveUserCommandHandler';
import { CreateUserCommand } from '../../web.core/interactors/user/commands/create-user/CreateUserCommand';
import { CreateUserCommandHandler } from '../../web.core/interactors/user/commands/create-user/CreateUserCommandHandler';
import { DeleteUserCommand } from '../../web.core/interactors/user/commands/delete-user/DeleteUserCommand';
import { DeleteUserCommandHandler } from '../../web.core/interactors/user/commands/delete-user/DeleteUserCommandHandler';
import { FindUserQuery } from '../../web.core/interactors/user/queries/find-user/FindUserQuery';
import { FindUserQueryHandler } from '../../web.core/interactors/user/queries/find-user/FindUserQueryHandler';
import { FindUserResult } from '../../web.core/interactors/user/queries/find-user/FindUserResult';
import { GetListOnlineStatusByIdsQuery } from '../../web.core/interactors/user/queries/get-list-online-status-by-ids/GetListOnlineStatusByIdsQuery';
import { GetListOnlineStatusByIdsQueryHandler } from '../../web.core/interactors/user/queries/get-list-online-status-by-ids/GetListOnlineStatusByIdsQueryHandler';
import { GetListOnlineStatusByIdsResult } from '../../web.core/interactors/user/queries/get-list-online-status-by-ids/GetListOnlineStatusByIdsResult';
import { GetUserByIdQuery } from '../../web.core/interactors/user/queries/get-user-by-id/GetUserByIdQuery';
import { GetUserByIdQueryHandler } from '../../web.core/interactors/user/queries/get-user-by-id/GetUserByIdQueryHandler';
import { GetUserByIdResult } from '../../web.core/interactors/user/queries/get-user-by-id/GetUserByIdResult';
import { PaginationResult } from '../../web.core/domain/common/interactor/PaginationResult';
import { RoleId } from '../../web.core/domain/enums/RoleId';
import { Service } from 'typedi';
import { UpdateUserCommand } from '../../web.core/interactors/user/commands/update-user/UpdateUserCommand';
import { UpdateUserCommandHandler } from '../../web.core/interactors/user/commands/update-user/UpdateUserCommandHandler';
import { UserAuthenticated } from '../../web.core/domain/common/UserAuthenticated';

@Service()
@JsonController('/users')
export class UserController {
    constructor(
        private _findUserQueryHandler: FindUserQueryHandler,
        private _getUserByIdQueryHandler: GetUserByIdQueryHandler,
        private _getListOnlineStatusByIdsQueryHandler: GetListOnlineStatusByIdsQueryHandler,
        private _createUserCommandHandler: CreateUserCommandHandler,
        private _updateUserCommandHandler: UpdateUserCommandHandler,
        private _archiveUserCommandHandler: ArchiveUserCommandHandler,
        private _deleteUserCommandHandler: DeleteUserCommandHandler
    ) {}

    @Get('/')
    @Authorized(RoleId.SUPER_ADMIN)
    async find(@QueryParams() param: FindUserQuery, @CurrentUser() userAuth: UserAuthenticated): Promise<PaginationResult<FindUserResult>> {
        param.roleAuthLevel = userAuth.role.level;
        return await this._findUserQueryHandler.handle(param);
    }

    @Get('/:id')
    @Authorized(RoleId.SUPER_ADMIN)
    async getById(@Params() param: GetUserByIdQuery, @CurrentUser() userAuth: UserAuthenticated): Promise<GetUserByIdResult> {
        param.roleAuthLevel = userAuth.role.level;
        return await this._getUserByIdQueryHandler.handle(param);
    }

    @Post('/list-online-status')
    @Authorized()
    async getListOnlineStatusByIds(@Body() param: GetListOnlineStatusByIdsQuery): Promise<GetListOnlineStatusByIdsResult[]> {
        return await this._getListOnlineStatusByIdsQueryHandler.handle(param);
    }

    @Post('/')
    @Authorized(RoleId.SUPER_ADMIN)
    async create(@Body() param: CreateUserCommand, @CurrentUser() userAuth: UserAuthenticated): Promise<string> {
        param.roleAuthLevel = userAuth.role.level;
        return await this._createUserCommandHandler.handle(param);
    }

    @Put('/:id')
    @Authorized(RoleId.SUPER_ADMIN)
    async update(@Param('id') id: string, @Body() param: UpdateUserCommand, @CurrentUser() userAuth: UserAuthenticated): Promise<boolean> {
        param.id = id;
        param.roleAuthLevel = userAuth.role.level;

        return await this._updateUserCommandHandler.handle(param);
    }

    @Post('/:id/archive')
    @Authorized(RoleId.SUPER_ADMIN)
    async archive(@Params() param: ArchiveUserCommand, @CurrentUser() userAuth: UserAuthenticated): Promise<boolean> {
        param.roleAuthLevel = userAuth.role.level;
        return await this._archiveUserCommandHandler.handle(param);
    }

    @Delete('/:id')
    @Authorized(RoleId.SUPER_ADMIN)
    async delete(@Params() param: DeleteUserCommand, @CurrentUser() userAuth: UserAuthenticated): Promise<boolean> {
        param.roleAuthLevel = userAuth.role.level;
        return await this._deleteUserCommandHandler.handle(param);
    }
}
