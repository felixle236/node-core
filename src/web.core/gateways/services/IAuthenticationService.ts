import { IUser } from '../../domain/types/IUser';

export interface IAuthenticationService {
    sign(user: IUser): string;

    verify(token: string): IJwtPayloadExtend;
}

export interface IJwtPayload {
    sub: string; // Subject
    exp: number; // Expiration time
    iat: number; // Issued at
    iss: string; // Issuer
    aud: string; // Audience
}

export interface IJwtPayloadExtend extends IJwtPayload {
    roleId: number;
}
