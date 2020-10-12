import { IUser } from '../../domain/types/user/IUser';

export interface IJwtPayload {
    sub: string; // Subject
    exp: number; // Expiration time
    iat: number; // Issued at
    iss: string; // Issuer
    aud: string; // Audience
}

export interface IJwtPayloadExtend extends IJwtPayload {
    roleId: string;
}

export interface IJwtAuthService {
    sign(user: IUser): string;

    verify(token: string): IJwtPayloadExtend;
}
