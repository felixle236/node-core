import { RoleId } from 'domain/enums/user/RoleId';
import { ActiveClientHandler } from 'application/usecases/user/client/active-client/ActiveClientHandler';
import { ActiveClientInput } from 'application/usecases/user/client/active-client/ActiveClientInput';
import { ActiveClientOutput } from 'application/usecases/user/client/active-client/ActiveClientOutput';
import { ArchiveClientHandler } from 'application/usecases/user/client/archive-client/ArchiveClientHandler';
import { ArchiveClientOutput } from 'application/usecases/user/client/archive-client/ArchiveClientOutput';
import { CreateClientHandler } from 'application/usecases/user/client/create-client/CreateClientHandler';
import { CreateClientInput } from 'application/usecases/user/client/create-client/CreateClientInput';
import { CreateClientOutput } from 'application/usecases/user/client/create-client/CreateClientOutput';
import { DeleteClientHandler } from 'application/usecases/user/client/delete-client/DeleteClientHandler';
import { DeleteClientOutput } from 'application/usecases/user/client/delete-client/DeleteClientOutput';
import { FindClientHandler } from 'application/usecases/user/client/find-client/FindClientHandler';
import { FindClientInput } from 'application/usecases/user/client/find-client/FindClientInput';
import { FindClientOutput } from 'application/usecases/user/client/find-client/FindClientOutput';
import { GetClientHandler } from 'application/usecases/user/client/get-client/GetClientHandler';
import { GetClientOutput } from 'application/usecases/user/client/get-client/GetClientOutput';
import { GetMyProfileClientHandler } from 'application/usecases/user/client/get-my-profile-client/GetMyProfileClientHandler';
import { GetMyProfileClientOutput } from 'application/usecases/user/client/get-my-profile-client/GetMyProfileClientOutput';
import { RegisterClientHandler } from 'application/usecases/user/client/register-client/RegisterClientHandler';
import { RegisterClientInput } from 'application/usecases/user/client/register-client/RegisterClientInput';
import { RegisterClientOutput } from 'application/usecases/user/client/register-client/RegisterClientOutput';
import { ResendActivationHandler } from 'application/usecases/user/client/resend-activation/ResendActivationHandler';
import { ResendActivationInput } from 'application/usecases/user/client/resend-activation/ResendActivationInput';
import { ResendActivationOutput } from 'application/usecases/user/client/resend-activation/ResendActivationOutput';
import { UpdateClientHandler } from 'application/usecases/user/client/update-client/UpdateClientHandler';
import { UpdateClientInput } from 'application/usecases/user/client/update-client/UpdateClientInput';
import { UpdateClientOutput } from 'application/usecases/user/client/update-client/UpdateClientOutput';
import { UpdateMyProfileClientHandler } from 'application/usecases/user/client/update-my-profile-client/UpdateMyProfileClientHandler';
import { UpdateMyProfileClientInput } from 'application/usecases/user/client/update-my-profile-client/UpdateMyProfileClientInput';
import { UpdateMyProfileClientOutput } from 'application/usecases/user/client/update-my-profile-client/UpdateMyProfileClientOutput';
import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { UsecaseOptionRequest } from 'shared/decorators/UsecaseOptionRequest';
import { UserAuthenticated } from 'shared/request/UserAuthenticated';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Service } from 'typedi';

@Service()
@JsonController('/v1/clients')
export class ClientController {
    constructor(
        private readonly _findClientHandler: FindClientHandler,
        private readonly _getClientHandler: GetClientHandler,
        private readonly _getMyProfileClientHandler: GetMyProfileClientHandler,
        private readonly _registerClientHandler: RegisterClientHandler,
        private readonly _activeClientHandler: ActiveClientHandler,
        private readonly _resendActivationHandler: ResendActivationHandler,
        private readonly _createClientHandler: CreateClientHandler,
        private readonly _updateClientHandler: UpdateClientHandler,
        private readonly _updateMyProfileClientHandler: UpdateMyProfileClientHandler,
        private readonly _deleteClientHandler: DeleteClientHandler,
        private readonly _archiveClientHandler: ArchiveClientHandler
    ) {}

    @Get('/')
    @Authorized([RoleId.SuperAdmin, RoleId.Manager])
    @OpenAPI({ summary: 'Find clients' })
    @ResponseSchema(FindClientOutput)
    find(@QueryParams() param: FindClientInput): Promise<FindClientOutput> {
        return this._findClientHandler.handle(param);
    }

    @Get('/:id([0-9a-f-]{36})')
    @Authorized([RoleId.SuperAdmin, RoleId.Manager])
    @OpenAPI({ summary: 'Get client' })
    @ResponseSchema(GetClientOutput)
    get(@Param('id') id: string): Promise<GetClientOutput> {
        return this._getClientHandler.handle(id);
    }

    @Get('/my-profile')
    @Authorized(RoleId.Client)
    @OpenAPI({ summary: 'Get my profile information' })
    @ResponseSchema(GetMyProfileClientOutput)
    getMyProfile(@CurrentUser() userAuth: UserAuthenticated): Promise<GetMyProfileClientOutput> {
        return this._getMyProfileClientHandler.handle(userAuth.userId);
    }

    @Post('/register')
    @OpenAPI({ summary: 'Register new client account' })
    @ResponseSchema(RegisterClientOutput)
    register(@Body() param: RegisterClientInput, @UsecaseOptionRequest() usecaseOption: UsecaseOption): Promise<RegisterClientOutput> {
        return this._registerClientHandler.handle(param, usecaseOption);
    }

    @Post('/active')
    @OpenAPI({ summary: 'Active client account' })
    @ResponseSchema(ActiveClientOutput)
    active(@Body() param: ActiveClientInput): Promise<ActiveClientOutput> {
        return this._activeClientHandler.handle(param);
    }

    @Post('/resend-activation')
    @OpenAPI({ summary: 'Resend activation for client' })
    @ResponseSchema(ResendActivationOutput)
    resendActivation(@Body() param: ResendActivationInput, @UsecaseOptionRequest() usecaseOption: UsecaseOption): Promise<ResendActivationOutput> {
        return this._resendActivationHandler.handle(param, usecaseOption);
    }

    @Post('/')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Create client account' })
    @ResponseSchema(CreateClientOutput)
    create(@Body() param: CreateClientInput): Promise<CreateClientOutput> {
        return this._createClientHandler.handle(param);
    }

    @Put('/:id([0-9a-f-]{36})')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Update client account' })
    @ResponseSchema(UpdateClientOutput)
    update(@Param('id') id: string, @Body() param: UpdateClientInput): Promise<UpdateClientOutput> {
        return this._updateClientHandler.handle(id, param);
    }

    @Put('/my-profile')
    @Authorized(RoleId.Client)
    @OpenAPI({ summary: 'Update my profile information' })
    @ResponseSchema(UpdateMyProfileClientOutput)
    updateMyProfile(@Body() param: UpdateMyProfileClientInput, @CurrentUser() userAuth: UserAuthenticated): Promise<UpdateMyProfileClientOutput> {
        return this._updateMyProfileClientHandler.handle(userAuth.userId, param);
    }

    @Delete('/:id([0-9a-f-]{36})')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Delete client account' })
    @ResponseSchema(DeleteClientOutput)
    delete(@Param('id') id: string): Promise<DeleteClientOutput> {
        return this._deleteClientHandler.handle(id);
    }

    @Post('/:id([0-9a-f-]{36})/archive')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Archive client account' })
    @ResponseSchema(ArchiveClientOutput)
    archive(@Param('id') id: string): Promise<ArchiveClientOutput> {
        return this._archiveClientHandler.handle(id);
    }
}
