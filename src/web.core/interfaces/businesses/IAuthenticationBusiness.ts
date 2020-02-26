import { UserAuthenticated } from '../../dtos/user/UserAuthenticated';
import { UserResponse } from '../../dtos/user/responses/UserResponse';
import { UserSigninRequest } from '../../dtos/user/requests/UserSigninRequest';
import { UserSigninSucceedResponse } from '../../dtos/user/responses/UserSigninSucceedResponse';
import { UserSignupRequest } from '../../dtos/user/requests/UserSignupRequest';

export interface IAuthenticationBusiness {
    authenticateUser(token: string, claims?: number[]): Promise<UserAuthenticated>;

    signin(data: UserSigninRequest): Promise<UserSigninSucceedResponse>;

    signup(data: UserSignupRequest): Promise<UserResponse | undefined>;

    active(confirmKey: string): Promise<boolean>;

    resendActivation(email: string): Promise<boolean>;

    forgotPassword(email: string): Promise<boolean>;

    resetPassword(confirmKey: string, password: string): Promise<boolean>;
}
