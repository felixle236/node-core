import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Params, Post, Put, QueryParams } from 'routing-controllers';
import { CreateDummyUserCommand, DummyUser } from '../../web.core/interactors/user/commands/create-dummy-user/CreateDummyUserCommand';
import { ArchiveUserCommand } from '../../web.core/interactors/user/commands/archive-user/ArchiveUserCommand';
import { ArchiveUserCommandHandler } from '../../web.core/interactors/user/commands/archive-user/ArchiveUserCommandHandler';
import { BulkActionResult } from '../../web.core/domain/common/interactor/BulkActionResult';
import { CreateDummyUserCommandHandler } from '../../web.core/interactors/user/commands/create-dummy-user/CreateDummyUserCommandHandler';
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
        private readonly _findUserQueryHandler: FindUserQueryHandler,
        private readonly _getUserByIdQueryHandler: GetUserByIdQueryHandler,
        private readonly _getListOnlineStatusByIdsQueryHandler: GetListOnlineStatusByIdsQueryHandler,
        private readonly _createUserCommandHandler: CreateUserCommandHandler,
        private readonly _updateUserCommandHandler: UpdateUserCommandHandler,
        private readonly _archiveUserCommandHandler: ArchiveUserCommandHandler,
        private readonly _deleteUserCommandHandler: DeleteUserCommandHandler,
        private readonly _createDummyUserCommandHandler: CreateDummyUserCommandHandler
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

    @Post('/dummy-managers')
    @Authorized(RoleId.SUPER_ADMIN)
    async createDummyManagers(): Promise<BulkActionResult> {
        const list: DummyUser[] = require('../../resources/data/dummy-managers');
        const param = new CreateDummyUserCommand();
        param.users = [];
        list.forEach(item => {
            const user = new DummyUser();
            user.roleId = item.roleId;
            user.firstName = item.firstName;
            user.lastName = item.lastName;
            user.email = item.email;
            user.password = item.password;
            user.gender = item.gender;
            user.avatar = item.avatar;

            param.users.push(user);
        });
        return await this._createDummyUserCommandHandler.handle(param);
    }

    @Post('/dummy-customers')
    @Authorized(RoleId.SUPER_ADMIN)
    async createDummyCustomers(): Promise<BulkActionResult> {
        const list: DummyUser[] = require('../../resources/data/dummy-customers');
        const param = new CreateDummyUserCommand();
        param.users = [];
        list.forEach(item => {
            const user = new DummyUser();
            user.roleId = item.roleId;
            user.firstName = item.firstName;
            user.lastName = item.lastName;
            user.email = item.email;
            user.password = item.password;
            user.gender = item.gender;
            user.avatar = item.avatar;

            param.users.push(user);
        });
        return await this._createDummyUserCommandHandler.handle(param);
    }
}
