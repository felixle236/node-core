import { UserAuthenticated } from '../../../dtos/common/UserAuthenticated';
import { UserLoginRequest } from '../../../dtos/user/requests/UserLoginRequest';
import { UserLoginSucceedResponse } from '../../../dtos/user/responses/UserLoginSucceedResponse';

export interface IAuthenticationInteractor {
    authenticateUser(token: string, roleIds?: number[]): Promise<UserAuthenticated>;

    login(data: UserLoginRequest): Promise<UserLoginSucceedResponse>;
}
