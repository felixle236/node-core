import { RoleId } from '@domain/enums/user/RoleId';
import { UserAuthenticated } from '@shared/UserAuthenticated';
import { ArchiveManagerHandler } from '@usecases/user/manager/archive-manager/ArchiveManagerHandler';
import { ArchiveManagerOutput } from '@usecases/user/manager/archive-manager/ArchiveManagerOutput';
import { CreateManagerHandler } from '@usecases/user/manager/create-manager/CreateManagerHandler';
import { CreateManagerInput } from '@usecases/user/manager/create-manager/CreateManagerInput';
import { CreateManagerOutput } from '@usecases/user/manager/create-manager/CreateManagerOutput';
import { DeleteManagerHandler } from '@usecases/user/manager/delete-manager/DeleteManagerHandler';
import { DeleteManagerOutput } from '@usecases/user/manager/delete-manager/DeleteManagerOutput';
import { FindManagerHandler } from '@usecases/user/manager/find-manager/FindManagerHandler';
import { FindManagerInput } from '@usecases/user/manager/find-manager/FindManagerInput';
import { FindManagerOutput } from '@usecases/user/manager/find-manager/FindManagerOutput';
import { GetManagerHandler } from '@usecases/user/manager/get-manager/GetManagerHandler';
import { GetManagerOutput } from '@usecases/user/manager/get-manager/GetManagerOutput';
import { GetMyProfileManagerHandler } from '@usecases/user/manager/get-my-profile-manager/GetMyProfileManagerHandler';
import { GetMyProfileManagerOutput } from '@usecases/user/manager/get-my-profile-manager/GetMyProfileManagerOutput';
import { UpdateManagerHandler } from '@usecases/user/manager/update-manager/UpdateManagerHandler';
import { UpdateManagerInput } from '@usecases/user/manager/update-manager/UpdateManagerInput';
import { UpdateManagerOutput } from '@usecases/user/manager/update-manager/UpdateManagerOutput';
import { UpdateMyProfileManagerHandler } from '@usecases/user/manager/update-my-profile-manager/UpdateMyProfileManagerHandler';
import { UpdateMyProfileManagerInput } from '@usecases/user/manager/update-my-profile-manager/UpdateMyProfileManagerInput';
import { UpdateMyProfileManagerOutput } from '@usecases/user/manager/update-my-profile-manager/UpdateMyProfileManagerOutput';
import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
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
    async find(@QueryParams() param: FindManagerInput): Promise<FindManagerOutput> {
        return await this._findManagerHandler.handle(param);
    }

    @Get('/:id([0-9a-f-]{36})')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Get manager' })
    @ResponseSchema(GetManagerOutput)
    async get(@Param('id') id: string): Promise<GetManagerOutput> {
        return await this._getManagerHandler.handle(id);
    }

    @Get('/my-profile')
    @Authorized([RoleId.SuperAdmin, RoleId.Manager])
    @OpenAPI({ summary: 'Get my profile information' })
    @ResponseSchema(GetMyProfileManagerOutput)
    async getMyProfile(@CurrentUser() userAuth: UserAuthenticated): Promise<GetMyProfileManagerOutput> {
        return await this._getMyProfileManagerHandler.handle(userAuth.userId);
    }

    @Post('/')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Create manager account' })
    @ResponseSchema(CreateManagerOutput)
    async create(@Body() param: CreateManagerInput): Promise<CreateManagerOutput> {
        return await this._createManagerHandler.handle(param);
    }

    @Put('/:id([0-9a-f-]{36})')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Update manager account' })
    @ResponseSchema(UpdateManagerOutput)
    async update(@Param('id') id: string, @Body() param: UpdateManagerInput): Promise<UpdateManagerOutput> {
        return await this._updateManagerHandler.handle(id, param);
    }

    @Put('/my-profile')
    @Authorized([RoleId.SuperAdmin, RoleId.Manager])
    @OpenAPI({ summary: 'Update my profile information' })
    @ResponseSchema(UpdateMyProfileManagerOutput)
    async updateMyProfile(@Body() param: UpdateMyProfileManagerInput, @CurrentUser() userAuth: UserAuthenticated): Promise<UpdateMyProfileManagerOutput> {
        return await this._updateMyProfileManagerHandler.handle(userAuth.userId, param);
    }

    @Delete('/:id([0-9a-f-]{36})')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Delete manager account' })
    @ResponseSchema(DeleteManagerOutput)
    async delete(@Param('id') id: string): Promise<DeleteManagerOutput> {
        return await this._deleteManagerHandler.handle(id);
    }

    @Post('/:id([0-9a-f-]{36})/archive')
    @Authorized(RoleId.SuperAdmin)
    @OpenAPI({ summary: 'Archive manager account' })
    @ResponseSchema(ArchiveManagerOutput)
    async archive(@Param('id') id: string): Promise<ArchiveManagerOutput> {
        return await this._archiveManagerHandler.handle(id);
    }
}
