import { Authorized, Controller, CurrentUser, Get, QueryParams, Render, Res } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { IUserInteractor } from '../../web.core/usecase/boundaries/interactors/IUserInteractor';
import { Response } from 'express';
import { UserAuthenticated } from '../../web.core/dtos/common/UserAuthenticated';
import { UserFilterRequest } from '../../web.core/dtos/user/requests/UserFilterRequest';

@Service()
@Controller('/users')
export class UserController {
    @Inject('user.interactor')
    private readonly _userInteractor: IUserInteractor;

    @Get('/')
    @Render('users/list')
    @Authorized()
    async find(@Res() response: Response, @CurrentUser() userAuth: UserAuthenticated, @QueryParams() filter: UserFilterRequest) {
        if (!userAuth)
            return response.redirect('/');

        const data = await this._userInteractor.find(filter, userAuth);
        return {
            title: 'User List',
            userAuth,
            data
        };
    }
}
