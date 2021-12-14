import { RoleId } from 'domain/enums/user/RoleId';
import { ImportClientTestHandler } from 'application/usecases/user/client/import-client-test/ImportClientTestHandler';
import { ImportManagerTestHandler } from 'application/usecases/user/manager/import-manager-test/ImportManagerTestHandler';
import { GetListOnlineStatusByIdsHandler } from 'application/usecases/user/user/get-list-online-status-by-ids/GetListOnlineStatusByIdsHandler';
import { GetListOnlineStatusByIdsInput } from 'application/usecases/user/user/get-list-online-status-by-ids/GetListOnlineStatusByIdsInput';
import { GetListOnlineStatusByIdsOutput } from 'application/usecases/user/user/get-list-online-status-by-ids/GetListOnlineStatusByIdsOutput';
import { PrivateAccessMiddleware } from 'exposes/api/web/middlewares/PrivateAccessMiddleware';
import { Authorized, Get, JsonController, Post, QueryParams, UseBefore } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@JsonController('/v1/users')
export class UserController {
    constructor(
        private readonly _getListOnlineStatusByIdsHandler: GetListOnlineStatusByIdsHandler,
        private readonly _importManagerTestHandler: ImportManagerTestHandler,
        private readonly _importClientTestHandler: ImportClientTestHandler
    ) {}

    @Get('/list-online-status')
    @Authorized()
    @ResponseSchema(GetListOnlineStatusByIdsOutput)
    getListOnlineStatusByIds(@QueryParams() param: GetListOnlineStatusByIdsInput): Promise<GetListOnlineStatusByIdsOutput> {
        return this._getListOnlineStatusByIdsHandler.handle(param);
    }

    @Get('/api-private')
    @UseBefore(PrivateAccessMiddleware)
    testApiPrivate(): Promise<{data: boolean}> {
        return Promise.resolve({ data: true });
    }

    @Post('/import-user-test')
    @Authorized(RoleId.SuperAdmin)
    async importUserTest(): Promise<{data: boolean}> {
        await this._importManagerTestHandler.handle();
        await this._importClientTestHandler.handle();
        return { data: true };
    }
}
