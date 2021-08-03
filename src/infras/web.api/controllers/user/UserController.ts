import { GetListOnlineStatusByIdsQueryHandler } from '@usecases/user/user/queries/get-list-online-status-by-ids/GetListOnlineStatusByIdsQueryHandler';
import { GetListOnlineStatusByIdsQueryInput } from '@usecases/user/user/queries/get-list-online-status-by-ids/GetListOnlineStatusByIdsQueryInput';
import { GetListOnlineStatusByIdsQueryOutput } from '@usecases/user/user/queries/get-list-online-status-by-ids/GetListOnlineStatusByIdsQueryOutput';
import { Authorized, Get, JsonController, QueryParams } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@JsonController('/v1/users')
export class UserController {
    constructor(
        private readonly _getListOnlineStatusByIdsQueryHandler: GetListOnlineStatusByIdsQueryHandler
    ) {}

    @Get('/list-online-status')
    @Authorized()
    @ResponseSchema(GetListOnlineStatusByIdsQueryOutput)
    async getListOnlineStatusByIds(@QueryParams() param: GetListOnlineStatusByIdsQueryInput): Promise<GetListOnlineStatusByIdsQueryOutput> {
        return await this._getListOnlineStatusByIdsQueryHandler.handle(param);
    }
}
