import { RoleId } from '@domain/enums/user/RoleId';
import { UserAuthenticated } from '@shared/UserAuthenticated';
import { ActiveClientCommandHandler } from '@usecases/user/client/commands/active-client/ActiveClientCommandHandler';
import { ActiveClientCommandInput } from '@usecases/user/client/commands/active-client/ActiveClientCommandInput';
import { ActiveClientCommandOutput } from '@usecases/user/client/commands/active-client/ActiveClientCommandOutput';
import { ArchiveClientCommandHandler } from '@usecases/user/client/commands/archive-client/ArchiveClientCommandHandler';
import { ArchiveClientCommandOutput } from '@usecases/user/client/commands/archive-client/ArchiveClientCommandOutput';
import { CreateClientCommandHandler } from '@usecases/user/client/commands/create-client/CreateClientCommandHandler';
import { CreateClientCommandInput } from '@usecases/user/client/commands/create-client/CreateClientCommandInput';
import { CreateClientCommandOutput } from '@usecases/user/client/commands/create-client/CreateClientCommandOutput';
import { DeleteClientCommandHandler } from '@usecases/user/client/commands/delete-client/DeleteClientCommandHandler';
import { DeleteClientCommandOutput } from '@usecases/user/client/commands/delete-client/DeleteClientCommandOutput';
import { RegisterClientCommandHandler } from '@usecases/user/client/commands/register-client/RegisterClientCommandHandler';
import { RegisterClientCommandInput } from '@usecases/user/client/commands/register-client/RegisterClientCommandInput';
import { RegisterClientCommandOutput } from '@usecases/user/client/commands/register-client/RegisterClientCommandOutput';
import { ResendActivationCommandHandler } from '@usecases/user/client/commands/resend-activation/ResendActivationCommandHandler';
import { ResendActivationCommandInput } from '@usecases/user/client/commands/resend-activation/ResendActivationCommandInput';
import { ResendActivationCommandOutput } from '@usecases/user/client/commands/resend-activation/ResendActivationCommandOutput';
import { UpdateClientCommandHandler } from '@usecases/user/client/commands/update-client/UpdateClientCommandHandler';
import { UpdateClientCommandInput } from '@usecases/user/client/commands/update-client/UpdateClientCommandInput';
import { UpdateClientCommandOutput } from '@usecases/user/client/commands/update-client/UpdateClientCommandOutput';
import { UpdateMyProfileClientCommandHandler } from '@usecases/user/client/commands/update-my-profile-client/UpdateMyProfileClientCommandHandler';
import { UpdateMyProfileClientCommandInput } from '@usecases/user/client/commands/update-my-profile-client/UpdateMyProfileClientCommandInput';
import { UpdateMyProfileClientCommandOutput } from '@usecases/user/client/commands/update-my-profile-client/UpdateMyProfileClientCommandOutput';
import { FindClientQueryHandler } from '@usecases/user/client/queries/find-client/FindClientQueryHandler';
import { FindClientQueryInput } from '@usecases/user/client/queries/find-client/FindClientQueryInput';
import { FindClientQueryOutput } from '@usecases/user/client/queries/find-client/FindClientQueryOutput';
import { GetClientByIdQueryHandler } from '@usecases/user/client/queries/get-client-by-id/GetClientByIdQueryHandler';
import { GetClientByIdQueryOutput } from '@usecases/user/client/queries/get-client-by-id/GetClientByIdQueryOutput';
import { GetMyProfileClientQueryHandler } from '@usecases/user/client/queries/get-my-profile-client/GetMyProfileClientQueryHandler';
import { GetMyProfileClientQueryOutput } from '@usecases/user/client/queries/get-my-profile-client/GetMyProfileClientQueryOutput';
import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@JsonController('/v1/clients')
export class ClientController {
    constructor(
        private readonly _findClientQueryHandler: FindClientQueryHandler,
        private readonly _getClientByIdQueryHandler: GetClientByIdQueryHandler,
        private readonly _getMyProfileClientQueryHandler: GetMyProfileClientQueryHandler,
        private readonly _registerClientCommandHandler: RegisterClientCommandHandler,
        private readonly _activeClientCommandHandler: ActiveClientCommandHandler,
        private readonly _resendActivationCommandHandler: ResendActivationCommandHandler,
        private readonly _createClientCommandHandler: CreateClientCommandHandler,
        private readonly _updateClientCommandHandler: UpdateClientCommandHandler,
        private readonly _updateMyProfileClientCommandHandler: UpdateMyProfileClientCommandHandler,
        private readonly _deleteClientCommandHandler: DeleteClientCommandHandler,
        private readonly _archiveClientCommandHandler: ArchiveClientCommandHandler
    ) {}

    @Get('/')
    @Authorized([RoleId.SuperAdmin, RoleId.Manager])
    @OpenAPI({ summary: 'Find clients' })
    @ResponseSchema(FindClientQueryOutput)
    async find(@QueryParams() param: FindClientQueryInput): Promise<FindClientQueryOutput> {
        return await this._findClientQueryHandler.handle(param);
    }

    @Get('/:id([0-9a-f-]{36})')
    @Authorized([RoleId.SuperAdmin, RoleId.Manager])
    @OpenAPI({ summary: 'Get client by id' })
    @ResponseSchema(GetClientByIdQueryOutput)
    async getById(@Param('id') id: string): Promise<GetClientByIdQueryOutput> {
        return await this._getClientByIdQueryHandler.handle(id);
    }

    @Get('/my-profile')
    @Authorized(RoleId.Client)
    @OpenAPI({ summary: 'Get my profile information' })
    @ResponseSchema(GetMyProfileClientQueryOutput)
    async getMyProfile(@CurrentUser() userAuth: UserAuthenticated): Promise<GetMyProfileClientQueryOutput> {
        return await this._getMyProfileClientQueryHandler.handle(userAuth.userId);
    }

    @Post('/register')
    @OpenAPI({ summary: 'Register new client account' })
    @ResponseSchema(RegisterClientCommandOutput)
    async register(@Body() param: RegisterClientCommandInput): Promise<RegisterClientCommandOutput> {
        return await this._registerClientCommandHandler.handle(param);
    }

    @Post('/active')
    @OpenAPI({ summary: 'Active client account' })
    @ResponseSchema(ActiveClientCommandOutput)
    async active(@Body() param: ActiveClientCommandInput): Promise<ActiveClientCommandOutput> {
        return await this._activeClientCommandHandler.handle(param);
    }

    @Post('/resend-activation')
    @OpenAPI({ summary: 'Resend activation for client' })
    @ResponseSchema(ResendActivationCommandOutput)
    async resendActivation(@Body() param: ResendActivationCommandInput): Promise<ResendActivationCommandOutput> {
        return await this._resendActivationCommandHandler.handle(param);
    }

    @Post('/')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Create client account' })
    @ResponseSchema(CreateClientCommandOutput)
    async create(@Body() param: CreateClientCommandInput): Promise<CreateClientCommandOutput> {
        return await this._createClientCommandHandler.handle(param);
    }

    @Put('/:id([0-9a-f-]{36})')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Update client account' })
    @ResponseSchema(UpdateClientCommandOutput)
    async update(@Param('id') id: string, @Body() param: UpdateClientCommandInput): Promise<UpdateClientCommandOutput> {
        return await this._updateClientCommandHandler.handle(id, param);
    }

    @Put('/my-profile')
    @Authorized(RoleId.Client)
    @OpenAPI({ summary: 'Update my profile information' })
    @ResponseSchema(UpdateMyProfileClientCommandOutput)
    async updateMyProfile(@Body() param: UpdateMyProfileClientCommandInput, @CurrentUser() userAuth: UserAuthenticated): Promise<UpdateMyProfileClientCommandOutput> {
        return await this._updateMyProfileClientCommandHandler.handle(userAuth.userId, param);
    }

    @Delete('/:id([0-9a-f-]{36})')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Delete client account' })
    @ResponseSchema(DeleteClientCommandOutput)
    async delete(@Param('id') id: string): Promise<DeleteClientCommandOutput> {
        return await this._deleteClientCommandHandler.handle(id);
    }

    @Post('/:id([0-9a-f-]{36})/archive')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Archive client account' })
    @ResponseSchema(ArchiveClientCommandOutput)
    async archive(@Param('id') id: string): Promise<ArchiveClientCommandOutput> {
        return await this._archiveClientCommandHandler.handle(id);
    }
}
