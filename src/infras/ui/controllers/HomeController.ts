import { UserAuthenticated } from '@shared/UserAuthenticated';
import { Authorized, Controller, CurrentUser, Get, Render } from 'routing-controllers';
import { Service } from 'typedi';

@Service()
@Controller()
export class HomeController {
    @Get('/')
    @Render('index')
    @Authorized()
    async home(@CurrentUser() userAuth: UserAuthenticated): Promise<any> {
        return {
            title: 'Node Core',
            userAuth
        };
    }
}
