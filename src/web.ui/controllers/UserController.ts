import { Authorized, Controller, CurrentUser, Get, QueryParams, Render, Res } from 'routing-controllers';
import { FindUserQuery } from '../../web.core/interactors/user/queries/find-user/FindUserQuery';
import { FindUserQueryHandler } from '../../web.core/interactors/user/queries/find-user/FindUserQueryHandler';
import { Response } from 'express';
import { Service } from 'typedi';
import { UserAuthenticated } from '../../web.core/domain/common/UserAuthenticated';

@Service()
@Controller('/users')
export class UserController {
    constructor(
        private readonly _findUserQueryHandler: FindUserQueryHandler
    ) {}

    @Get('/')
    @Render('users/list')
    @Authorized()
    async find(@Res() response: Response, @CurrentUser() userAuth: UserAuthenticated, @QueryParams() param: FindUserQuery) {
        if (!userAuth)
            return response.redirect('/');

        param.roleAuthId = userAuth.roleId;
        const result = await this._findUserQueryHandler.handle(param);
        return {
            title: 'User List',
            userAuth,
            result
        };
    }
}
