import { PrivateAccessMiddleware } from '@infras/api/middlewares/PrivateAccessMiddleware';
import { GetListOnlineStatusByIdsHandler } from '@usecases/user/user/get-list-online-status-by-ids/GetListOnlineStatusByIdsHandler';
import { GetListOnlineStatusByIdsInput } from '@usecases/user/user/get-list-online-status-by-ids/GetListOnlineStatusByIdsInput';
import { GetListOnlineStatusByIdsOutput } from '@usecases/user/user/get-list-online-status-by-ids/GetListOnlineStatusByIdsOutput';
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
    async getListOnlineStatusByIds(@QueryParams() param: GetListOnlineStatusByIdsInput): Promise<GetListOnlineStatusByIdsOutput> {
        return await this._getListOnlineStatusByIdsHandler.handle(param);
    }

    @Get('/api-private')
    @UseBefore(PrivateAccessMiddleware)
    async testApiPrivate(): Promise<{data: boolean}> {
        return { data: true };
    }
}
