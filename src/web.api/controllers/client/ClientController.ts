import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Params, Post, Put, QueryParams } from 'routing-controllers';
import { Service } from 'typedi';
import { UserAuthenticated } from '../../../web.core/domain/common/UserAuthenticated';
import { RoleId } from '../../../web.core/domain/enums/role/RoleId';
import { ActiveClientCommand } from '../../../web.core/usecases/client/commands/active-client/ActiveClientCommand';
import { ActiveClientCommandHandler } from '../../../web.core/usecases/client/commands/active-client/ActiveClientCommandHandler';
import { ArchiveClientCommand } from '../../../web.core/usecases/client/commands/archive-client/ArchiveClientCommand';
import { ArchiveClientCommandHandler } from '../../../web.core/usecases/client/commands/archive-client/ArchiveClientCommandHandler';
import { CreateClientCommand } from '../../../web.core/usecases/client/commands/create-client/CreateClientCommand';
import { CreateClientCommandHandler } from '../../../web.core/usecases/client/commands/create-client/CreateClientCommandHandler';
import { DeleteClientCommand } from '../../../web.core/usecases/client/commands/delete-client/DeleteClientCommand';
import { DeleteClientCommandHandler } from '../../../web.core/usecases/client/commands/delete-client/DeleteClientCommandHandler';
import { RegisterClientCommand } from '../../../web.core/usecases/client/commands/register-client/RegisterClientCommand';
import { RegisterClientCommandHandler } from '../../../web.core/usecases/client/commands/register-client/RegisterClientCommandHandler';
import { ResendActivationCommand } from '../../../web.core/usecases/client/commands/resend-activation/ResendActivationCommand';
import { ResendActivationCommandHandler } from '../../../web.core/usecases/client/commands/resend-activation/ResendActivationCommandHandler';
import { UpdateClientCommand } from '../../../web.core/usecases/client/commands/update-client/UpdateClientCommand';
import { UpdateClientCommandHandler } from '../../../web.core/usecases/client/commands/update-client/UpdateClientCommandHandler';
import { FindClientQuery } from '../../../web.core/usecases/client/queries/find-client/FindClientQuery';
import { FindClientQueryHandler } from '../../../web.core/usecases/client/queries/find-client/FindClientQueryHandler';
import { GetClientByIdQuery } from '../../../web.core/usecases/client/queries/get-client-by-id/GetClientByIdQuery';
import { GetClientByIdQueryHandler } from '../../../web.core/usecases/client/queries/get-client-by-id/GetClientByIdQueryHandler';

@Service()
@JsonController('/v1/clients')
export class ClientController {
    constructor(
        private readonly _findClientQueryHandler: FindClientQueryHandler,
        private readonly _getClientByIdQueryHandler: GetClientByIdQueryHandler,
        private readonly _registerClientCommandHandler: RegisterClientCommandHandler,
        private readonly _activeClientCommandHandler: ActiveClientCommandHandler,
        private readonly _resendActivationCommandHandler: ResendActivationCommandHandler,
        private readonly _createClientCommandHandler: CreateClientCommandHandler,
        private readonly _updateClientCommandHandler: UpdateClientCommandHandler,
        private readonly _deleteClientCommandHandler: DeleteClientCommandHandler,
        private readonly _archiveClientCommandHandler: ArchiveClientCommandHandler
    ) {}

    @Get('/')
    @Authorized([RoleId.SUPER_ADMIN, RoleId.MANAGER])
    async find(@QueryParams() param: FindClientQuery, @CurrentUser() userAuth: UserAuthenticated) {
        param.roleAuthId = userAuth.roleId;
        return await this._findClientQueryHandler.handle(param);
    }

    @Get('/:id([0-9a-f-]{36})')
    @Authorized([RoleId.SUPER_ADMIN, RoleId.MANAGER])
    async getById(@Params() param: GetClientByIdQuery, @CurrentUser() userAuth: UserAuthenticated) {
        param.roleAuthId = userAuth.roleId;
        return await this._getClientByIdQueryHandler.handle(param);
    }

    @Post('/register')
    async register(@Body() param: RegisterClientCommand) {
        return await this._registerClientCommandHandler.handle(param);
    }

    @Post('/active')
    async active(@Body() param: ActiveClientCommand) {
        return await this._activeClientCommandHandler.handle(param);
    }

    @Post('/resend-activation')
    async resendActivation(@Body() param: ResendActivationCommand) {
        return await this._resendActivationCommandHandler.handle(param);
    }

    @Post('/')
    @Authorized([RoleId.SUPER_ADMIN])
    async create(@Body() param: CreateClientCommand, @CurrentUser() userAuth: UserAuthenticated) {
        param.roleAuthId = userAuth.roleId;
        return await this._createClientCommandHandler.handle(param);
    }

    @Put('/:id([0-9a-f-]{36})')
    @Authorized(RoleId.SUPER_ADMIN)
    async update(@Param('id') id: string, @Body() param: UpdateClientCommand): Promise<boolean> {
        param.id = id;
        return await this._updateClientCommandHandler.handle(param);
    }

    @Delete('/:id([0-9a-f-]{36})')
    @Authorized([RoleId.SUPER_ADMIN])
    async delete(@Params() param: DeleteClientCommand, @CurrentUser() userAuth: UserAuthenticated) {
        param.roleAuthId = userAuth.roleId;
        return await this._deleteClientCommandHandler.handle(param);
    }

    @Post('/:id([0-9a-f-]{36})/archive')
    @Authorized([RoleId.SUPER_ADMIN])
    async archive(@Params() param: ArchiveClientCommand, @CurrentUser() userAuth: UserAuthenticated) {
        param.roleAuthId = userAuth.roleId;
        return await this._archiveClientCommandHandler.handle(param);
    }
}
