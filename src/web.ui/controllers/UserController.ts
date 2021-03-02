import { Response } from 'express';
import { Authorized, Controller, CurrentUser, Get, QueryParams, Render, Res } from 'routing-controllers';
import { Service } from 'typedi';
import { UserAuthenticated } from '../../web.core/domain/common/UserAuthenticated';
import { FindClientQuery } from '../../web.core/usecases/client/queries/find-client/FindClientQuery';
import { FindClientQueryHandler } from '../../web.core/usecases/client/queries/find-client/FindClientQueryHandler';

@Service()
@Controller('/users')
export class UserController {
    constructor(
        private readonly _findClientQueryHandler: FindClientQueryHandler
    ) {}

    @Get('/')
    @Render('users/list')
    @Authorized()
    async find(@Res() response: Response, @QueryParams() param: FindClientQuery, @CurrentUser() userAuth: UserAuthenticated) {
        if (!userAuth)
            return response.redirect('/');

        param.roleAuthId = userAuth.roleId;
        const result = await this._findClientQueryHandler.handle(param);
        return {
            title: 'User List',
            userAuth,
            result
        };
    }
}
