import { RoleId } from '@domain/enums/user/RoleId';
import { UserAuthenticated } from '@shared/UserAuthenticated';
import { FindClientQueryHandler } from '@usecases/user/client/queries/find-client/FindClientQueryHandler';
import { FindClientQueryInput } from '@usecases/user/client/queries/find-client/FindClientQueryInput';
import { Response } from 'express';
import { Authorized, Controller, CurrentUser, Get, QueryParams, Render, Res } from 'routing-controllers';
import { Inject, Service } from 'typedi';

@Service()
@Controller('/users')
export class UserController {
    @Inject()
    private readonly _findClientQueryHandler: FindClientQueryHandler;

    @Get('/')
    @Render('users/index')
    @Authorized([RoleId.SuperAdmin, RoleId.Manager])
    async find(@Res() response: Response, @QueryParams() param: FindClientQueryInput, @CurrentUser() userAuth: UserAuthenticated): Promise<any> {
        if (!userAuth)
            return response.redirect('/');

        const result = await this._findClientQueryHandler.handle(param);
        return {
            title: 'User List',
            userAuth,
            result
        };
    }
}
