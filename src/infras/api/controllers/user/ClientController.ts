import { RoleId } from '@domain/enums/user/RoleId';
import { UsecaseOptionRequest } from '@shared/decorators/UsecaseOptionRequest';
import { UsecaseOption } from '@shared/usecase/UsecaseOption';
import { UserAuthenticated } from '@shared/UserAuthenticated';
import { ActiveClientHandler } from '@usecases/user/client/active-client/ActiveClientHandler';
import { ActiveClientInput } from '@usecases/user/client/active-client/ActiveClientInput';
import { ActiveClientOutput } from '@usecases/user/client/active-client/ActiveClientOutput';
import { ArchiveClientHandler } from '@usecases/user/client/archive-client/ArchiveClientHandler';
import { ArchiveClientOutput } from '@usecases/user/client/archive-client/ArchiveClientOutput';
import { CreateClientHandler } from '@usecases/user/client/create-client/CreateClientHandler';
import { CreateClientInput } from '@usecases/user/client/create-client/CreateClientInput';
import { CreateClientOutput } from '@usecases/user/client/create-client/CreateClientOutput';
import { DeleteClientHandler } from '@usecases/user/client/delete-client/DeleteClientHandler';
import { DeleteClientOutput } from '@usecases/user/client/delete-client/DeleteClientOutput';
import { FindClientHandler } from '@usecases/user/client/find-client/FindClientHandler';
import { FindClientInput } from '@usecases/user/client/find-client/FindClientInput';
import { FindClientOutput } from '@usecases/user/client/find-client/FindClientOutput';
import { GetClientHandler } from '@usecases/user/client/get-client/GetClientHandler';
import { GetClientOutput } from '@usecases/user/client/get-client/GetClientOutput';
import { GetMyProfileClientHandler } from '@usecases/user/client/get-my-profile-client/GetMyProfileClientHandler';
import { GetMyProfileClientOutput } from '@usecases/user/client/get-my-profile-client/GetMyProfileClientOutput';
import { RegisterClientHandler } from '@usecases/user/client/register-client/RegisterClientHandler';
import { RegisterClientInput } from '@usecases/user/client/register-client/RegisterClientInput';
import { RegisterClientOutput } from '@usecases/user/client/register-client/RegisterClientOutput';
import { ResendActivationHandler } from '@usecases/user/client/resend-activation/ResendActivationHandler';
import { ResendActivationInput } from '@usecases/user/client/resend-activation/ResendActivationInput';
import { ResendActivationOutput } from '@usecases/user/client/resend-activation/ResendActivationOutput';
import { UpdateClientHandler } from '@usecases/user/client/update-client/UpdateClientHandler';
import { UpdateClientInput } from '@usecases/user/client/update-client/UpdateClientInput';
import { UpdateClientOutput } from '@usecases/user/client/update-client/UpdateClientOutput';
import { UpdateMyProfileClientHandler } from '@usecases/user/client/update-my-profile-client/UpdateMyProfileClientHandler';
import { UpdateMyProfileClientInput } from '@usecases/user/client/update-my-profile-client/UpdateMyProfileClientInput';
import { UpdateMyProfileClientOutput } from '@usecases/user/client/update-my-profile-client/UpdateMyProfileClientOutput';
import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
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
    async find(@QueryParams() param: FindClientInput): Promise<FindClientOutput> {
        return await this._findClientHandler.handle(param);
    }

    @Get('/:id([0-9a-f-]{36})')
    @Authorized([RoleId.SuperAdmin, RoleId.Manager])
    @OpenAPI({ summary: 'Get client' })
    @ResponseSchema(GetClientOutput)
    async get(@Param('id') id: string): Promise<GetClientOutput> {
        return await this._getClientHandler.handle(id);
    }

    @Get('/my-profile')
    @Authorized(RoleId.Client)
    @OpenAPI({ summary: 'Get my profile information' })
    @ResponseSchema(GetMyProfileClientOutput)
    async getMyProfile(@CurrentUser() userAuth: UserAuthenticated): Promise<GetMyProfileClientOutput> {
        return await this._getMyProfileClientHandler.handle(userAuth.userId);
    }

    @Post('/register')
    @OpenAPI({ summary: 'Register new client account' })
    @ResponseSchema(RegisterClientOutput)
    async register(@Body() param: RegisterClientInput, @UsecaseOptionRequest() usecaseOption: UsecaseOption): Promise<RegisterClientOutput> {
        return await this._registerClientHandler.handle(param, usecaseOption);
    }

    @Post('/active')
    @OpenAPI({ summary: 'Active client account' })
    @ResponseSchema(ActiveClientOutput)
    async active(@Body() param: ActiveClientInput): Promise<ActiveClientOutput> {
        return await this._activeClientHandler.handle(param);
    }

    @Post('/resend-activation')
    @OpenAPI({ summary: 'Resend activation for client' })
    @ResponseSchema(ResendActivationOutput)
    async resendActivation(@Body() param: ResendActivationInput, @UsecaseOptionRequest() usecaseOption: UsecaseOption): Promise<ResendActivationOutput> {
        return await this._resendActivationHandler.handle(param, usecaseOption);
    }

    @Post('/')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Create client account' })
    @ResponseSchema(CreateClientOutput)
    async create(@Body() param: CreateClientInput): Promise<CreateClientOutput> {
        return await this._createClientHandler.handle(param);
    }

    @Put('/:id([0-9a-f-]{36})')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Update client account' })
    @ResponseSchema(UpdateClientOutput)
    async update(@Param('id') id: string, @Body() param: UpdateClientInput): Promise<UpdateClientOutput> {
        return await this._updateClientHandler.handle(id, param);
    }

    @Put('/my-profile')
    @Authorized(RoleId.Client)
    @OpenAPI({ summary: 'Update my profile information' })
    @ResponseSchema(UpdateMyProfileClientOutput)
    async updateMyProfile(@Body() param: UpdateMyProfileClientInput, @CurrentUser() userAuth: UserAuthenticated): Promise<UpdateMyProfileClientOutput> {
        return await this._updateMyProfileClientHandler.handle(userAuth.userId, param);
    }

    @Delete('/:id([0-9a-f-]{36})')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Delete client account' })
    @ResponseSchema(DeleteClientOutput)
    async delete(@Param('id') id: string): Promise<DeleteClientOutput> {
        return await this._deleteClientHandler.handle(id);
    }

    @Post('/:id([0-9a-f-]{36})/archive')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Archive client account' })
    @ResponseSchema(ArchiveClientOutput)
    async archive(@Param('id') id: string): Promise<ArchiveClientOutput> {
        return await this._archiveClientHandler.handle(id);
    }
}
