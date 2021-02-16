import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Params, Post, Put, QueryParam, QueryParams } from 'routing-controllers';
import { Service } from 'typedi';
import { BulkActionResult } from '../../../web.core/domain/common/usecase/BulkActionResult';
import { PaginationResult } from '../../../web.core/domain/common/usecase/PaginationResult';
import { UserAuthenticated } from '../../../web.core/domain/common/UserAuthenticated';
import { RoleId } from '../../../web.core/domain/enums/role/RoleId';
import { ArchiveUserCommand } from '../../../web.core/usecases/user/commands/archive-user/ArchiveUserCommand';
import { ArchiveUserCommandHandler } from '../../../web.core/usecases/user/commands/archive-user/ArchiveUserCommandHandler';
import { CreateDummyUserCommand, DummyUser } from '../../../web.core/usecases/user/commands/create-dummy-user/CreateDummyUserCommand';
import { CreateDummyUserCommandHandler } from '../../../web.core/usecases/user/commands/create-dummy-user/CreateDummyUserCommandHandler';
import { CreateUserCommand } from '../../../web.core/usecases/user/commands/create-user/CreateUserCommand';
import { CreateUserCommandHandler } from '../../../web.core/usecases/user/commands/create-user/CreateUserCommandHandler';
import { DeleteUserCommand } from '../../../web.core/usecases/user/commands/delete-user/DeleteUserCommand';
import { DeleteUserCommandHandler } from '../../../web.core/usecases/user/commands/delete-user/DeleteUserCommandHandler';
import { UpdateUserCommand } from '../../../web.core/usecases/user/commands/update-user/UpdateUserCommand';
import { UpdateUserCommandHandler } from '../../../web.core/usecases/user/commands/update-user/UpdateUserCommandHandler';
import { FindUserQuery } from '../../../web.core/usecases/user/queries/find-user/FindUserQuery';
import { FindUserQueryHandler } from '../../../web.core/usecases/user/queries/find-user/FindUserQueryHandler';
import { FindUserQueryResult } from '../../../web.core/usecases/user/queries/find-user/FindUserQueryResult';
import { GetListOnlineStatusByIdsQuery } from '../../../web.core/usecases/user/queries/get-list-online-status-by-ids/GetListOnlineStatusByIdsQuery';
import { GetListOnlineStatusByIdsQueryHandler } from '../../../web.core/usecases/user/queries/get-list-online-status-by-ids/GetListOnlineStatusByIdsQueryHandler';
import { GetListOnlineStatusByIdsQueryResult } from '../../../web.core/usecases/user/queries/get-list-online-status-by-ids/GetListOnlineStatusByIdsQueryResult';
import { GetUserByIdQuery } from '../../../web.core/usecases/user/queries/get-user-by-id/GetUserByIdQuery';
import { GetUserByIdQueryHandler } from '../../../web.core/usecases/user/queries/get-user-by-id/GetUserByIdQueryHandler';
import { GetUserByIdQueryResult } from '../../../web.core/usecases/user/queries/get-user-by-id/GetUserByIdQueryResult';

@Service()
@JsonController('/v1/users')
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
    @Authorized([RoleId.SUPER_ADMIN, RoleId.MANAGER])
    async find(@QueryParams() param: FindUserQuery, @CurrentUser() userAuth: UserAuthenticated, @QueryParam('roleId') roleId: RoleId | null): Promise<PaginationResult<FindUserQueryResult>> {
        param.roleAuthId = userAuth.roleId;
        param.roleIds = roleId ? [roleId] : [];
        return await this._findUserQueryHandler.handle(param);
    }

    @Get('/:id([0-9a-f-]{36})')
    @Authorized([RoleId.SUPER_ADMIN, RoleId.MANAGER])
    async getById(@Params() param: GetUserByIdQuery, @CurrentUser() userAuth: UserAuthenticated): Promise<GetUserByIdQueryResult> {
        param.roleAuthId = userAuth.roleId;
        return await this._getUserByIdQueryHandler.handle(param);
    }

    @Post('/list-online-status')
    @Authorized()
    async getListOnlineStatusByIds(@Body() param: GetListOnlineStatusByIdsQuery): Promise<GetListOnlineStatusByIdsQueryResult[]> {
        return await this._getListOnlineStatusByIdsQueryHandler.handle(param);
    }

    @Post('/')
    @Authorized(RoleId.SUPER_ADMIN)
    async create(@Body() param: CreateUserCommand): Promise<string> {
        return await this._createUserCommandHandler.handle(param);
    }

    @Put('/:id([0-9a-f-]{36})')
    @Authorized(RoleId.SUPER_ADMIN)
    async update(@Param('id') id: string, @Body() param: UpdateUserCommand): Promise<boolean> {
        param.id = id;
        return await this._updateUserCommandHandler.handle(param);
    }

    @Post('/:id([0-9a-f-]{36})/archive')
    @Authorized([RoleId.SUPER_ADMIN, RoleId.MANAGER])
    async archive(@Params() param: ArchiveUserCommand, @CurrentUser() userAuth: UserAuthenticated): Promise<boolean> {
        param.roleAuthId = userAuth.roleId;
        return await this._archiveUserCommandHandler.handle(param);
    }

    @Delete('/:id([0-9a-f-]{36})')
    @Authorized(RoleId.SUPER_ADMIN)
    async delete(@Params() param: DeleteUserCommand): Promise<boolean> {
        return await this._deleteUserCommandHandler.handle(param);
    }

    @Post('/dummy-managers')
    @Authorized(RoleId.SUPER_ADMIN)
    async createDummyManagers(): Promise<BulkActionResult> {
        const list: DummyUser[] = require('../../../resources/data/dummy-managers');
        const param = new CreateDummyUserCommand();
        param.users = [];
        list.forEach(item => {
            const user = new DummyUser();
            user.roleId = item.roleId;
            user.firstName = item.firstName;
            user.lastName = item.lastName;
            user.email = item.email;
            user.password = item.password;
            user.avatar = item.avatar;

            param.users.push(user);
        });
        return await this._createDummyUserCommandHandler.handle(param);
    }

    @Post('/dummy-clients')
    @Authorized(RoleId.SUPER_ADMIN)
    async createDummyClients(): Promise<BulkActionResult> {
        const list: DummyUser[] = require('../../../resources/data/dummy-clients');
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
