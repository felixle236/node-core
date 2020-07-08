import { RoleResponse } from '../role/responses/RoleResponse';

export class UserAuthenticated {
    id: number;
    role: RoleResponse;
    accessToken: string;
}
