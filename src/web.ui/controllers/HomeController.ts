import { Authorized, Controller, CurrentUser, Get, Render } from 'routing-controllers';
import { Service } from 'typedi';
import { UserAuthenticated } from '../../web.core/domain/common/UserAuthenticated';

@Service()
@Controller()
export class HomeController {
    @Get('/')
    @Render('index')
    @Authorized()
    home(@CurrentUser() userAuth: UserAuthenticated) {
        return {
            title: 'Node Core',
            userAuth
        };
    }
}
