import { IncomingHttpHeaders } from 'http';
import { AUTH_SECRET_OR_PRIVATE_KEY, AUTH_SECRET_OR_PUBLIC_KEY, AUTH_SIGNATURE, DOMAIN, PROJECT_NAME, PROTOTYPE } from '@configs/Configuration';
import { AuthType } from '@domain/enums/auth/AuthType';
import { IAuthJwtService, IJwtPayloadExtend } from '@gateways/services/IAuthJwtService';
import jwt from 'jsonwebtoken';
import { Service } from 'typedi';

@Service('auth_jwt.service')
export class AuthJwtService implements IAuthJwtService {
    getTokenFromHeader(headers: IncomingHttpHeaders): string {
        let token = '';
        if (headers.authorization) {
            const parts = headers.authorization.split(' ');
            token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : '';
        }
        return token;
    }

    sign(userId: string, roleId: string, type: AuthType): string {
        return jwt.sign({
            userId,
            roleId,
            type
        }, AUTH_SECRET_OR_PRIVATE_KEY, {
            subject: 'user_auth',
            expiresIn: 24 * 60 * 60,
            issuer: PROJECT_NAME,
            audience: `${PROTOTYPE}://${DOMAIN}`,
            algorithm: AUTH_SIGNATURE
        } as jwt.SignOptions);
    }

    verify(token: string): IJwtPayloadExtend {
        return jwt.verify(token, AUTH_SECRET_OR_PUBLIC_KEY, {
            issuer: PROJECT_NAME,
            audience: `${PROTOTYPE}://${DOMAIN}`,
            algorithm: AUTH_SIGNATURE
        } as jwt.VerifyOptions) as IJwtPayloadExtend;
    }
}
