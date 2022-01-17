import { RoleId } from 'domain/enums/user/RoleId';
import { ActiveClientHandler } from 'application/usecases/user/client/active-client/ActiveClientHandler';
import { ActiveClientInput, ActiveClientOutput } from 'application/usecases/user/client/active-client/ActiveClientSchema';
import { ArchiveClientHandler } from 'application/usecases/user/client/archive-client/ArchiveClientHandler';
import { ArchiveClientOutput } from 'application/usecases/user/client/archive-client/ArchiveClientSchema';
import { CreateClientHandler } from 'application/usecases/user/client/create-client/CreateClientHandler';
import { CreateClientInput, CreateClientOutput } from 'application/usecases/user/client/create-client/CreateClientSchema';
import { DeleteClientHandler } from 'application/usecases/user/client/delete-client/DeleteClientHandler';
import { DeleteClientOutput } from 'application/usecases/user/client/delete-client/DeleteClientSchema';
import { FindClientHandler } from 'application/usecases/user/client/find-client/FindClientHandler';
import { FindClientInput, FindClientOutput } from 'application/usecases/user/client/find-client/FindClientSchema';
import { GetClientHandler } from 'application/usecases/user/client/get-client/GetClientHandler';
import { GetClientOutput } from 'application/usecases/user/client/get-client/GetClientSchema';
import { GetProfileClientHandler } from 'application/usecases/user/client/get-profile-client/GetProfileClientHandler';
import { GetProfileClientOutput } from 'application/usecases/user/client/get-profile-client/GetProfileClientSchema';
import { RegisterClientHandler } from 'application/usecases/user/client/register-client/RegisterClientHandler';
import { RegisterClientInput, RegisterClientOutput } from 'application/usecases/user/client/register-client/RegisterClientSchema';
import { ResendActivationHandler } from 'application/usecases/user/client/resend-activation/ResendActivationHandler';
import { ResendActivationInput, ResendActivationOutput } from 'application/usecases/user/client/resend-activation/ResendActivationSchema';
import { UpdateClientHandler } from 'application/usecases/user/client/update-client/UpdateClientHandler';
import { UpdateClientInput, UpdateClientOutput } from 'application/usecases/user/client/update-client/UpdateClientSchema';
import { UpdateProfileClientHandler } from 'application/usecases/user/client/update-profile-client/UpdateProfileClientHandler';
import { UpdateProfileClientInput, UpdateProfileClientOutput } from 'application/usecases/user/client/update-profile-client/UpdateProfileClientSchema';
import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { UsecaseOptionRequest } from 'shared/decorators/UsecaseOptionRequest';
import { UserAuthenticated } from 'shared/request/UserAuthenticated';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Service } from 'typedi';
import { generateAuthRequiredDoc } from 'utils/Common';

@Service()
@JsonController('/v1/clients')
export class ClientController {
  constructor(
    private readonly _findClientHandler: FindClientHandler,
    private readonly _getClientHandler: GetClientHandler,
    private readonly _getProfileClientHandler: GetProfileClientHandler,
    private readonly _registerClientHandler: RegisterClientHandler,
    private readonly _activeClientHandler: ActiveClientHandler,
    private readonly _resendActivationHandler: ResendActivationHandler,
    private readonly _createClientHandler: CreateClientHandler,
    private readonly _updateClientHandler: UpdateClientHandler,
    private readonly _updateProfileClientHandler: UpdateProfileClientHandler,
    private readonly _deleteClientHandler: DeleteClientHandler,
    private readonly _archiveClientHandler: ArchiveClientHandler,
  ) {}

  @Get('/')
  @Authorized([RoleId.SuperAdmin, RoleId.Manager])
  @OpenAPI({ summary: 'Find clients', description: generateAuthRequiredDoc(RoleId.SuperAdmin, RoleId.Manager) })
  @ResponseSchema(FindClientOutput)
  find(@QueryParams() param: FindClientInput): Promise<FindClientOutput> {
    return this._findClientHandler.handle(param);
  }

  @Get('/:id([0-9a-f-]{36})')
  @Authorized([RoleId.SuperAdmin, RoleId.Manager])
  @OpenAPI({ summary: 'Get client', description: generateAuthRequiredDoc(RoleId.SuperAdmin, RoleId.Manager) })
  @ResponseSchema(GetClientOutput)
  get(@Param('id') id: string): Promise<GetClientOutput> {
    return this._getClientHandler.handle(id);
  }

  @Get('/profile')
  @Authorized(RoleId.Client)
  @OpenAPI({ summary: 'Get profile information', description: generateAuthRequiredDoc(RoleId.Client) })
  @ResponseSchema(GetProfileClientOutput)
  getProfile(@CurrentUser() userAuth: UserAuthenticated): Promise<GetProfileClientOutput> {
    return this._getProfileClientHandler.handle(userAuth.userId);
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
  @OpenAPI({ summary: 'Create client account', description: generateAuthRequiredDoc(RoleId.SuperAdmin) })
  @ResponseSchema(CreateClientOutput)
  create(@Body() param: CreateClientInput): Promise<CreateClientOutput> {
    return this._createClientHandler.handle(param);
  }

  @Put('/:id([0-9a-f-]{36})')
  @Authorized(RoleId.SuperAdmin)
  @OpenAPI({ summary: 'Update client account', description: generateAuthRequiredDoc(RoleId.SuperAdmin) })
  @ResponseSchema(UpdateClientOutput)
  update(@Param('id') id: string, @Body() param: UpdateClientInput): Promise<UpdateClientOutput> {
    return this._updateClientHandler.handle(id, param);
  }

  @Put('/profile')
  @Authorized(RoleId.Client)
  @OpenAPI({ summary: 'Update profile information', description: generateAuthRequiredDoc(RoleId.Client) })
  @ResponseSchema(UpdateProfileClientOutput)
  updateProfile(@Body() param: UpdateProfileClientInput, @CurrentUser() userAuth: UserAuthenticated): Promise<UpdateProfileClientOutput> {
    return this._updateProfileClientHandler.handle(userAuth.userId, param);
  }

  @Delete('/:id([0-9a-f-]{36})')
  @Authorized(RoleId.SuperAdmin)
  @OpenAPI({ summary: 'Delete client account', description: generateAuthRequiredDoc(RoleId.SuperAdmin) })
  @ResponseSchema(DeleteClientOutput)
  delete(@Param('id') id: string): Promise<DeleteClientOutput> {
    return this._deleteClientHandler.handle(id);
  }

  @Post('/:id([0-9a-f-]{36})/archive')
  @Authorized(RoleId.SuperAdmin)
  @OpenAPI({ summary: 'Archive client account', description: generateAuthRequiredDoc(RoleId.SuperAdmin) })
  @ResponseSchema(ArchiveClientOutput)
  archive(@Param('id') id: string): Promise<ArchiveClientOutput> {
    return this._archiveClientHandler.handle(id);
  }
}
