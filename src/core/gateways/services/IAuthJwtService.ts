import { AuthType } from '@domain/enums/auth/AuthType';

export interface IJwtPayload {
    sub: string; // Subject
    exp: number; // Expiration time
    iat: number; // Issued at
    iss: string; // Issuer
    aud: string; // Audience
}

export interface IJwtPayloadExtend extends IJwtPayload {
    roleId: string;
    type: AuthType;
}

export interface IAuthJwtService {
    sign(userId: string, roleId: string, type: AuthType): string;

    verify(token: string): IJwtPayloadExtend;
}
