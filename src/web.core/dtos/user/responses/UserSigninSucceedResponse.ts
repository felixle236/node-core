import { User } from '../../../models/User';
import { UserResponse } from './UserResponse';

export class UserSigninSucceedResponse {
    profile: UserResponse;
    claims: number[];
    accessToken: string;

    constructor(model: User, accessToken: string) {
        this.profile = new UserResponse(model);
        this.claims = model.role && model.role.permissions ? model.role.permissions.map(permission => permission.claim) : [];
        this.accessToken = accessToken;
    }
}
