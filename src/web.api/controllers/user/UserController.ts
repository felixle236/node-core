import { Authorized, Body, JsonController, Post } from 'routing-controllers';
import { Service } from 'typedi';
import { GetListOnlineStatusByIdsQuery } from '../../../web.core/usecases/user/queries/get-list-online-status-by-ids/GetListOnlineStatusByIdsQuery';
import { GetListOnlineStatusByIdsQueryHandler } from '../../../web.core/usecases/user/queries/get-list-online-status-by-ids/GetListOnlineStatusByIdsQueryHandler';
import { GetListOnlineStatusByIdsQueryResult } from '../../../web.core/usecases/user/queries/get-list-online-status-by-ids/GetListOnlineStatusByIdsQueryResult';

@Service()
@JsonController('/v1/users')
export class UserController {
    constructor(
        private readonly _getListOnlineStatusByIdsQueryHandler: GetListOnlineStatusByIdsQueryHandler
    ) {}

    @Post('/list-online-status')
    @Authorized()
    async getListOnlineStatusByIds(@Body() param: GetListOnlineStatusByIdsQuery): Promise<GetListOnlineStatusByIdsQueryResult[]> {
        return await this._getListOnlineStatusByIdsQueryHandler.handle(param);
    }
}
