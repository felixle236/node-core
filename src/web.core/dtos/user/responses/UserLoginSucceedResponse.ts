import { User } from '../../../models/User';
import { UserResponse } from './UserResponse';

export class UserLoginSucceedResponse {
    profile: UserResponse;
    accessToken: string;

    constructor(model: User, accessToken: string) {
        this.profile = new UserResponse(model);
        this.accessToken = accessToken;
    }
}
