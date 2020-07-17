import { RoleResponse } from '../role/responses/RoleResponse';

export class UserAuthenticated {
    userId: number;
    role: RoleResponse;
    accessToken: string;
}
