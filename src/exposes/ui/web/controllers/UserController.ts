import { RoleId } from 'domain/enums/user/RoleId';
import { FindClientHandler } from 'application/usecases/user/client/find-client/FindClientHandler';
import { FindClientInput } from 'application/usecases/user/client/find-client/FindClientInput';
import { Response } from 'express';
import { Authorized, Controller, CurrentUser, Get, QueryParams, Render, Res } from 'routing-controllers';
import { UserAuthenticated } from 'shared/request/UserAuthenticated';
import { Inject, Service } from 'typedi';

@Service()
@Controller('/users')
export class UserController {
    constructor(
        @Inject() private readonly _findClientHandler: FindClientHandler
    ) {}

    @Get('/')
    @Render('users/index')
    @Authorized([RoleId.SuperAdmin, RoleId.Manager])
    async find(@Res() response: Response, @QueryParams() param: FindClientInput, @CurrentUser() userAuth: UserAuthenticated): Promise<any> {
        if (!userAuth)
            return response.redirect('/');

        const result = await this._findClientHandler.handle(param);
        return {
            title: 'User List',
            userAuth,
            result
        };
    }
}
