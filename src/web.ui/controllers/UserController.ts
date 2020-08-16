import { Authorized, Controller, CurrentUser, Get, QueryParams, Render, Res } from 'routing-controllers';
import { FindUserFilter } from '../../web.core/interactors/user/find-user/Filter';
import { FindUserInteractor } from '../../web.core/interactors/user/find-user/Interactor';
import { Response } from 'express';
import { Service } from 'typedi';
import { UserAuthenticated } from '../../web.core/domain/common/UserAuthenticated';

@Service()
@Controller('/users')
export class UserController {
    constructor(
        private readonly _findUserInteractor: FindUserInteractor
    ) {}

    @Get('/')
    @Render('users/list')
    @Authorized()
    async find(@Res() response: Response, @CurrentUser() userAuth: UserAuthenticated, @QueryParams() filter: FindUserFilter) {
        if (!userAuth)
            return response.redirect('/');

        const data = await this._findUserInteractor.handle(filter, userAuth);
        return {
            title: 'User List',
            userAuth,
            data
        };
    }
}
