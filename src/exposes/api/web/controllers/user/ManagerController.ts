import { RoleId } from 'domain/enums/user/RoleId';
import { ArchiveManagerHandler } from 'application/usecases/user/manager/archive-manager/ArchiveManagerHandler';
import { ArchiveManagerOutput } from 'application/usecases/user/manager/archive-manager/ArchiveManagerOutput';
import { CreateManagerHandler } from 'application/usecases/user/manager/create-manager/CreateManagerHandler';
import { CreateManagerInput } from 'application/usecases/user/manager/create-manager/CreateManagerInput';
import { CreateManagerOutput } from 'application/usecases/user/manager/create-manager/CreateManagerOutput';
import { DeleteManagerHandler } from 'application/usecases/user/manager/delete-manager/DeleteManagerHandler';
import { DeleteManagerOutput } from 'application/usecases/user/manager/delete-manager/DeleteManagerOutput';
import { FindManagerHandler } from 'application/usecases/user/manager/find-manager/FindManagerHandler';
import { FindManagerInput } from 'application/usecases/user/manager/find-manager/FindManagerInput';
import { FindManagerOutput } from 'application/usecases/user/manager/find-manager/FindManagerOutput';
import { GetManagerHandler } from 'application/usecases/user/manager/get-manager/GetManagerHandler';
import { GetManagerOutput } from 'application/usecases/user/manager/get-manager/GetManagerOutput';
import { GetMyProfileManagerHandler } from 'application/usecases/user/manager/get-my-profile-manager/GetMyProfileManagerHandler';
import { GetMyProfileManagerOutput } from 'application/usecases/user/manager/get-my-profile-manager/GetMyProfileManagerOutput';
import { UpdateManagerHandler } from 'application/usecases/user/manager/update-manager/UpdateManagerHandler';
import { UpdateManagerInput } from 'application/usecases/user/manager/update-manager/UpdateManagerInput';
import { UpdateManagerOutput } from 'application/usecases/user/manager/update-manager/UpdateManagerOutput';
import { UpdateMyProfileManagerHandler } from 'application/usecases/user/manager/update-my-profile-manager/UpdateMyProfileManagerHandler';
import { UpdateMyProfileManagerInput } from 'application/usecases/user/manager/update-my-profile-manager/UpdateMyProfileManagerInput';
import { UpdateMyProfileManagerOutput } from 'application/usecases/user/manager/update-my-profile-manager/UpdateMyProfileManagerOutput';
import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { UserAuthenticated } from 'shared/request/UserAuthenticated';
import { Service } from 'typedi';

@Service()
@JsonController('/v1/managers')
export class ManagerController {
    constructor(
        private readonly _findManagerHandler: FindManagerHandler,
        private readonly _getManagerHandler: GetManagerHandler,
        private readonly _getMyProfileManagerHandler: GetMyProfileManagerHandler,
        private readonly _createManagerHandler: CreateManagerHandler,
        private readonly _updateManagerHandler: UpdateManagerHandler,
        private readonly _updateMyProfileManagerHandler: UpdateMyProfileManagerHandler,
        private readonly _deleteManagerHandler: DeleteManagerHandler,
        private readonly _archiveManagerHandler: ArchiveManagerHandler
    ) {}

    @Get('/')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Find managers' })
    @ResponseSchema(FindManagerOutput)
    find(@QueryParams() param: FindManagerInput): Promise<FindManagerOutput> {
        return this._findManagerHandler.handle(param);
    }

    @Get('/:id([0-9a-f-]{36})')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Get manager' })
    @ResponseSchema(GetManagerOutput)
    get(@Param('id') id: string): Promise<GetManagerOutput> {
        return this._getManagerHandler.handle(id);
    }

    @Get('/my-profile')
    @Authorized([RoleId.SuperAdmin, RoleId.Manager])
    @OpenAPI({ summary: 'Get my profile information' })
    @ResponseSchema(GetMyProfileManagerOutput)
    getMyProfile(@CurrentUser() userAuth: UserAuthenticated): Promise<GetMyProfileManagerOutput> {
        return this._getMyProfileManagerHandler.handle(userAuth.userId);
    }

    @Post('/')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Create manager account' })
    @ResponseSchema(CreateManagerOutput)
    create(@Body() param: CreateManagerInput): Promise<CreateManagerOutput> {
        return this._createManagerHandler.handle(param);
    }

    @Put('/:id([0-9a-f-]{36})')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Update manager account' })
    @ResponseSchema(UpdateManagerOutput)
    update(@Param('id') id: string, @Body() param: UpdateManagerInput): Promise<UpdateManagerOutput> {
        return this._updateManagerHandler.handle(id, param);
    }

    @Put('/my-profile')
    @Authorized([RoleId.SuperAdmin, RoleId.Manager])
    @OpenAPI({ summary: 'Update my profile information' })
    @ResponseSchema(UpdateMyProfileManagerOutput)
    updateMyProfile(@Body() param: UpdateMyProfileManagerInput, @CurrentUser() userAuth: UserAuthenticated): Promise<UpdateMyProfileManagerOutput> {
        return this._updateMyProfileManagerHandler.handle(userAuth.userId, param);
    }

    @Delete('/:id([0-9a-f-]{36})')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Delete manager account' })
    @ResponseSchema(DeleteManagerOutput)
    delete(@Param('id') id: string): Promise<DeleteManagerOutput> {
        return this._deleteManagerHandler.handle(id);
    }

    @Post('/:id([0-9a-f-]{36})/archive')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Archive manager account' })
    @ResponseSchema(ArchiveManagerOutput)
    archive(@Param('id') id: string): Promise<ArchiveManagerOutput> {
        return this._archiveManagerHandler.handle(id);
    }
}
