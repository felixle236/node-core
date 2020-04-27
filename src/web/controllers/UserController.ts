import { Authorized, Controller, CurrentUser, Get, QueryParams, Render, Res } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { IUserBusiness } from '../../web.core/interfaces/businesses/IUserBusiness';
import { Response } from 'express';
import { UserAuthenticated } from '../../web.core/dtos/user/UserAuthenticated';
import { UserFilterRequest } from '../../web.core/dtos/user/requests/UserFilterRequest';

@Service()
@Controller('/users')
export class UserController {
    @Inject('user.business')
    private readonly userBusiness: IUserBusiness;

    @Get('/')
    @Render('users/list')
    @Authorized()
    async find(@Res() response: Response, @CurrentUser() userAuth: UserAuthenticated, @QueryParams() filter: UserFilterRequest) {
        if (!userAuth)
            return response.redirect('/');

        const data = await this.userBusiness.find(filter, userAuth);
        return {
            title: 'User List',
            userAuth,
            data
        };
    }
}
