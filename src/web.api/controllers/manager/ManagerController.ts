import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Params, Post, Put, QueryParams } from 'routing-controllers';
import { Service } from 'typedi';
import { UserAuthenticated } from '../../../web.core/domain/common/UserAuthenticated';
import { RoleId } from '../../../web.core/domain/enums/role/RoleId';
import { ArchiveManagerCommand } from '../../../web.core/usecases/manager/commands/archive-manager/ArchiveManagerCommand';
import { ArchiveManagerCommandHandler } from '../../../web.core/usecases/manager/commands/archive-manager/ArchiveManagerCommandHandler';
import { CreateManagerCommand } from '../../../web.core/usecases/manager/commands/create-manager/CreateManagerCommand';
import { CreateManagerCommandHandler } from '../../../web.core/usecases/manager/commands/create-manager/CreateManagerCommandHandler';
import { DeleteManagerCommand } from '../../../web.core/usecases/manager/commands/delete-manager/DeleteManagerCommand';
import { DeleteManagerCommandHandler } from '../../../web.core/usecases/manager/commands/delete-manager/DeleteManagerCommandHandler';
import { UpdateManagerCommand } from '../../../web.core/usecases/manager/commands/update-manager/UpdateManagerCommand';
import { UpdateManagerCommandHandler } from '../../../web.core/usecases/manager/commands/update-manager/UpdateManagerCommandHandler';
import { FindManagerQuery } from '../../../web.core/usecases/manager/queries/find-manager/FindManagerQuery';
import { FindManagerQueryHandler } from '../../../web.core/usecases/manager/queries/find-manager/FindManagerQueryHandler';
import { GetManagerByIdQuery } from '../../../web.core/usecases/manager/queries/get-manager-by-id/GetManagerByIdQuery';
import { GetManagerByIdQueryHandler } from '../../../web.core/usecases/manager/queries/get-manager-by-id/GetManagerByIdQueryHandler';

@Service()
@JsonController('/v1/managers')
export class ManagerController {
    constructor(
        private readonly _findManagerQueryHandler: FindManagerQueryHandler,
        private readonly _getManagerByIdQueryHandler: GetManagerByIdQueryHandler,
        private readonly _createManagerCommandHandler: CreateManagerCommandHandler,
        private readonly _updateManagerCommandHandler: UpdateManagerCommandHandler,
        private readonly _deleteManagerCommandHandler: DeleteManagerCommandHandler,
        private readonly _archiveManagerCommandHandler: ArchiveManagerCommandHandler
    ) {}

    @Get('/')
    @Authorized([RoleId.SUPER_ADMIN])
    async find(@QueryParams() param: FindManagerQuery, @CurrentUser() userAuth: UserAuthenticated) {
        param.roleAuthId = userAuth.roleId;
        return await this._findManagerQueryHandler.handle(param);
    }

    @Get('/:id([0-9a-f-]{36})')
    @Authorized([RoleId.SUPER_ADMIN])
    async getById(@Params() param: GetManagerByIdQuery, @CurrentUser() userAuth: UserAuthenticated) {
        param.roleAuthId = userAuth.roleId;
        return await this._getManagerByIdQueryHandler.handle(param);
    }

    @Post('/')
    @Authorized([RoleId.SUPER_ADMIN])
    async create(@Body() param: CreateManagerCommand, @CurrentUser() userAuth: UserAuthenticated) {
        param.roleAuthId = userAuth.roleId;
        return await this._createManagerCommandHandler.handle(param);
    }

    @Put('/:id([0-9a-f-]{36})')
    @Authorized(RoleId.SUPER_ADMIN)
    async update(@Param('id') id: string, @Body() param: UpdateManagerCommand): Promise<boolean> {
        param.id = id;
        return await this._updateManagerCommandHandler.handle(param);
    }

    @Delete('/:id([0-9a-f-]{36})')
    @Authorized([RoleId.SUPER_ADMIN])
    async delete(@Params() param: DeleteManagerCommand, @CurrentUser() userAuth: UserAuthenticated) {
        param.roleAuthId = userAuth.roleId;
        return await this._deleteManagerCommandHandler.handle(param);
    }

    @Post('/:id([0-9a-f-]{36})/archive')
    @Authorized([RoleId.SUPER_ADMIN])
    async archive(@Params() param: ArchiveManagerCommand, @CurrentUser() userAuth: UserAuthenticated) {
        param.roleAuthId = userAuth.roleId;
        return await this._archiveManagerCommandHandler.handle(param);
    }
}
