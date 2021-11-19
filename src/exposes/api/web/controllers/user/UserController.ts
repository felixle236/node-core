import { GetListOnlineStatusByIdsHandler } from 'application/usecases/user/user/get-list-online-status-by-ids/GetListOnlineStatusByIdsHandler';
import { GetListOnlineStatusByIdsInput } from 'application/usecases/user/user/get-list-online-status-by-ids/GetListOnlineStatusByIdsInput';
import { GetListOnlineStatusByIdsOutput } from 'application/usecases/user/user/get-list-online-status-by-ids/GetListOnlineStatusByIdsOutput';
import { PrivateAccessMiddleware } from 'exposes/api/web/middlewares/PrivateAccessMiddleware';
import { Authorized, Get, JsonController, QueryParams, UseBefore } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@JsonController('/v1/users')
export class UserController {
    constructor(
        private readonly _getListOnlineStatusByIdsHandler: GetListOnlineStatusByIdsHandler
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
}
