import { RoleId } from 'domain/enums/user/RoleId';
import { ArchiveManagerHandler } from 'application/usecases/user/manager/archive-manager/ArchiveManagerHandler';
import { ArchiveManagerOutput } from 'application/usecases/user/manager/archive-manager/ArchiveManagerSchema';
import { CreateManagerHandler } from 'application/usecases/user/manager/create-manager/CreateManagerHandler';
import { CreateManagerInput, CreateManagerOutput } from 'application/usecases/user/manager/create-manager/CreateManagerSchema';
import { DeleteManagerHandler } from 'application/usecases/user/manager/delete-manager/DeleteManagerHandler';
import { DeleteManagerOutput } from 'application/usecases/user/manager/delete-manager/DeleteManagerSchema';
import { FindManagerHandler } from 'application/usecases/user/manager/find-manager/FindManagerHandler';
import { FindManagerInput, FindManagerOutput } from 'application/usecases/user/manager/find-manager/FindManagerSchema';
import { GetManagerHandler } from 'application/usecases/user/manager/get-manager/GetManagerHandler';
import { GetManagerOutput } from 'application/usecases/user/manager/get-manager/GetManagerSchema';
import { GetProfileManagerHandler } from 'application/usecases/user/manager/get-profile-manager/GetProfileManagerHandler';
import { GetProfileManagerOutput } from 'application/usecases/user/manager/get-profile-manager/GetProfileManagerSchema';
import { UpdateManagerHandler } from 'application/usecases/user/manager/update-manager/UpdateManagerHandler';
import { UpdateManagerInput, UpdateManagerOutput } from 'application/usecases/user/manager/update-manager/UpdateManagerSchema';
import { UpdateProfileManagerHandler } from 'application/usecases/user/manager/update-profile-manager/UpdateProfileManagerHandler';
import { UpdateProfileManagerInput, UpdateProfileManagerOutput } from 'application/usecases/user/manager/update-profile-manager/UpdateProfileManagerSchema';
import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { UserAuthenticated } from 'shared/request/UserAuthenticated';
import { Service } from 'typedi';
import { generateAuthRequiredDoc } from 'utils/Common';

@Service()
@JsonController('/v1/managers')
export class ManagerController {
  constructor(
    private readonly _findManagerHandler: FindManagerHandler,
    private readonly _getManagerHandler: GetManagerHandler,
    private readonly _getProfileManagerHandler: GetProfileManagerHandler,
    private readonly _createManagerHandler: CreateManagerHandler,
    private readonly _updateManagerHandler: UpdateManagerHandler,
    private readonly _updateProfileManagerHandler: UpdateProfileManagerHandler,
    private readonly _deleteManagerHandler: DeleteManagerHandler,
    private readonly _archiveManagerHandler: ArchiveManagerHandler,
  ) {}

  @Get('/')
  @Authorized(RoleId.SuperAdmin)
  @OpenAPI({ summary: 'Find managers', description: generateAuthRequiredDoc(RoleId.SuperAdmin) })
  @ResponseSchema(FindManagerOutput)
  find(@QueryParams() param: FindManagerInput): Promise<FindManagerOutput> {
    return this._findManagerHandler.handle(param);
  }

  @Get('/:id([0-9a-f-]{36})')
  @Authorized(RoleId.SuperAdmin)
  @OpenAPI({ summary: 'Get manager', description: generateAuthRequiredDoc(RoleId.SuperAdmin) })
  @ResponseSchema(GetManagerOutput)
  get(@Param('id') id: string): Promise<GetManagerOutput> {
    return this._getManagerHandler.handle(id);
  }

  @Get('/profile')
  @Authorized([RoleId.SuperAdmin, RoleId.Manager])
  @OpenAPI({ summary: 'Get profile information', description: generateAuthRequiredDoc(RoleId.SuperAdmin, RoleId.Manager) })
  @ResponseSchema(GetProfileManagerOutput)
  getProfile(@CurrentUser() userAuth: UserAuthenticated): Promise<GetProfileManagerOutput> {
    return this._getProfileManagerHandler.handle(userAuth.userId);
  }

  @Post('/')
  @Authorized(RoleId.SuperAdmin)
  @OpenAPI({ summary: 'Create manager account', description: generateAuthRequiredDoc(RoleId.SuperAdmin) })
  @ResponseSchema(CreateManagerOutput)
  create(@Body() param: CreateManagerInput): Promise<CreateManagerOutput> {
    return this._createManagerHandler.handle(param);
  }

  @Put('/:id([0-9a-f-]{36})')
  @Authorized(RoleId.SuperAdmin)
  @OpenAPI({ summary: 'Update manager account', description: generateAuthRequiredDoc(RoleId.SuperAdmin) })
  @ResponseSchema(UpdateManagerOutput)
  update(@Param('id') id: string, @Body() param: UpdateManagerInput): Promise<UpdateManagerOutput> {
    return this._updateManagerHandler.handle(id, param);
  }

  @Put('/profile')
  @Authorized([RoleId.SuperAdmin, RoleId.Manager])
  @OpenAPI({ summary: 'Update profile information', description: generateAuthRequiredDoc(RoleId.SuperAdmin, RoleId.Manager) })
  @ResponseSchema(UpdateProfileManagerOutput)
  updateProfile(@Body() param: UpdateProfileManagerInput, @CurrentUser() userAuth: UserAuthenticated): Promise<UpdateProfileManagerOutput> {
    return this._updateProfileManagerHandler.handle(userAuth.userId, param);
  }

  @Delete('/:id([0-9a-f-]{36})')
  @Authorized(RoleId.SuperAdmin)
  @OpenAPI({ summary: 'Delete manager account', description: generateAuthRequiredDoc(RoleId.SuperAdmin) })
  @ResponseSchema(DeleteManagerOutput)
  delete(@Param('id') id: string): Promise<DeleteManagerOutput> {
    return this._deleteManagerHandler.handle(id);
  }

  @Post('/:id([0-9a-f-]{36})/archive')
  @Authorized(RoleId.SuperAdmin)
  @OpenAPI({ summary: 'Archive manager account', description: generateAuthRequiredDoc(RoleId.SuperAdmin) })
  @ResponseSchema(ArchiveManagerOutput)
  archive(@Param('id') id: string): Promise<ArchiveManagerOutput> {
    return this._archiveManagerHandler.handle(id);
  }
}
