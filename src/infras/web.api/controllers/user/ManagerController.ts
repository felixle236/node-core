import { RoleId } from '@domain/enums/user/RoleId';
import { UserAuthenticated } from '@shared/UserAuthenticated';
import { ArchiveManagerCommandHandler } from '@usecases/user/manager/commands/archive-manager/ArchiveManagerCommandHandler';
import { ArchiveManagerCommandOutput } from '@usecases/user/manager/commands/archive-manager/ArchiveManagerCommandOutput';
import { CreateManagerCommandHandler } from '@usecases/user/manager/commands/create-manager/CreateManagerCommandHandler';
import { CreateManagerCommandInput } from '@usecases/user/manager/commands/create-manager/CreateManagerCommandInput';
import { CreateManagerCommandOutput } from '@usecases/user/manager/commands/create-manager/CreateManagerCommandOutput';
import { DeleteManagerCommandHandler } from '@usecases/user/manager/commands/delete-manager/DeleteManagerCommandHandler';
import { DeleteManagerCommandOutput } from '@usecases/user/manager/commands/delete-manager/DeleteManagerCommandOutput';
import { UpdateManagerCommandHandler } from '@usecases/user/manager/commands/update-manager/UpdateManagerCommandHandler';
import { UpdateManagerCommandInput } from '@usecases/user/manager/commands/update-manager/UpdateManagerCommandInput';
import { UpdateManagerCommandOutput } from '@usecases/user/manager/commands/update-manager/UpdateManagerCommandOutput';
import { UpdateMyProfileManagerCommandHandler } from '@usecases/user/manager/commands/update-my-profile-manager/UpdateMyProfileManagerCommandHandler';
import { UpdateMyProfileManagerCommandInput } from '@usecases/user/manager/commands/update-my-profile-manager/UpdateMyProfileManagerCommandInput';
import { UpdateMyProfileManagerCommandOutput } from '@usecases/user/manager/commands/update-my-profile-manager/UpdateMyProfileManagerCommandOutput';
import { FindManagerQueryHandler } from '@usecases/user/manager/queries/find-manager/FindManagerQueryHandler';
import { FindManagerQueryInput } from '@usecases/user/manager/queries/find-manager/FindManagerQueryInput';
import { FindManagerQueryOutput } from '@usecases/user/manager/queries/find-manager/FindManagerQueryOutput';
import { GetManagerByIdQueryHandler } from '@usecases/user/manager/queries/get-manager-by-id/GetManagerByIdQueryHandler';
import { GetManagerByIdQueryOutput } from '@usecases/user/manager/queries/get-manager-by-id/GetManagerByIdQueryOutput';
import { GetMyProfileManagerQueryHandler } from '@usecases/user/manager/queries/get-my-profile-manager/GetMyProfileManagerQueryHandler';
import { GetMyProfileManagerQueryOutput } from '@usecases/user/manager/queries/get-my-profile-manager/GetMyProfileManagerQueryOutput';
import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post, Put, QueryParams } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@JsonController('/v1/managers')
export class ManagerController {
    constructor(
        private readonly _findManagerQueryHandler: FindManagerQueryHandler,
        private readonly _getManagerByIdQueryHandler: GetManagerByIdQueryHandler,
        private readonly _getMyProfileManagerQueryHandler: GetMyProfileManagerQueryHandler,
        private readonly _createManagerCommandHandler: CreateManagerCommandHandler,
        private readonly _updateManagerCommandHandler: UpdateManagerCommandHandler,
        private readonly _updateMyProfileManagerCommandHandler: UpdateMyProfileManagerCommandHandler,
        private readonly _deleteManagerCommandHandler: DeleteManagerCommandHandler,
        private readonly _archiveManagerCommandHandler: ArchiveManagerCommandHandler
    ) {}

    @Get('/')
    @Authorized(RoleId.SUPER_ADMIN)
    @OpenAPI({ summary: 'Find managers' })
    @ResponseSchema(FindManagerQueryOutput)
    async find(@QueryParams() param: FindManagerQueryInput): Promise<FindManagerQueryOutput> {
        return await this._findManagerQueryHandler.handle(param);
    }

    @Get('/:id([0-9a-f-]{36})')
    @Authorized(RoleId.SUPER_ADMIN)
    @OpenAPI({ summary: 'Get manager by id' })
    @ResponseSchema(GetManagerByIdQueryOutput)
    async getById(@Param('id') id: string): Promise<GetManagerByIdQueryOutput> {
        return await this._getManagerByIdQueryHandler.handle(id);
    }

    @Get('/my-profile')
    @Authorized([RoleId.SUPER_ADMIN, RoleId.MANAGER])
    @OpenAPI({ summary: 'Get my profile information' })
    @ResponseSchema(GetMyProfileManagerQueryOutput)
    async getMyProfile(@CurrentUser() userAuth: UserAuthenticated): Promise<GetMyProfileManagerQueryOutput> {
        return await this._getMyProfileManagerQueryHandler.handle(userAuth.userId);
    }

    @Post('/')
    @Authorized(RoleId.SUPER_ADMIN)
    @OpenAPI({ summary: 'Create manager account' })
    @ResponseSchema(CreateManagerCommandOutput)
    async create(@Body() param: CreateManagerCommandInput): Promise<CreateManagerCommandOutput> {
        return await this._createManagerCommandHandler.handle(param);
    }

    @Put('/:id([0-9a-f-]{36})')
    @Authorized(RoleId.SUPER_ADMIN)
    @OpenAPI({ summary: 'Update manager account' })
    @ResponseSchema(UpdateManagerCommandOutput)
    async update(@Param('id') id: string, @Body() param: UpdateManagerCommandInput): Promise<UpdateManagerCommandOutput> {
        return await this._updateManagerCommandHandler.handle(id, param);
    }

    @Put('/my-profile')
    @Authorized([RoleId.SUPER_ADMIN, RoleId.MANAGER])
    @OpenAPI({ summary: 'Update my profile information' })
    @ResponseSchema(UpdateMyProfileManagerCommandOutput)
    async updateMyProfile(@Body() param: UpdateMyProfileManagerCommandInput, @CurrentUser() userAuth: UserAuthenticated): Promise<UpdateMyProfileManagerCommandOutput> {
        return await this._updateMyProfileManagerCommandHandler.handle(userAuth.userId, param);
    }

    @Delete('/:id([0-9a-f-]{36})')
    @Authorized(RoleId.SUPER_ADMIN)
    @OpenAPI({ summary: 'Delete manager account' })
    @ResponseSchema(DeleteManagerCommandOutput)
    async delete(@Param('id') id: string): Promise<DeleteManagerCommandOutput> {
        return await this._deleteManagerCommandHandler.handle(id);
    }

    @Post('/:id([0-9a-f-]{36})/archive')
    @Authorized(RoleId.SUPER_ADMIN)
    @OpenAPI({ summary: 'Archive manager account' })
    @ResponseSchema(ArchiveManagerCommandOutput)
    async archive(@Param('id') id: string): Promise<ArchiveManagerCommandOutput> {
        return await this._archiveManagerCommandHandler.handle(id);
    }
}
