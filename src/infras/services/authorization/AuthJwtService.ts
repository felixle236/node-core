import { AUTH_SECRET_OR_PRIVATE_KEY, AUTH_SECRET_OR_PUBLIC_KEY, AUTH_SIGNATURE, DOMAIN, PROJECT_NAME, PROTOTYPE } from '@configs/Configuration';
import { AuthType } from '@domain/enums/auth/AuthType';
import { IAuthJwtService, IJwtPayloadExtend } from '@gateways/services/IAuthJwtService';
import jwt from 'jsonwebtoken';
import { Service } from 'typedi';

@Service('auth_jwt.service')
export class AuthJwtService implements IAuthJwtService {
    sign(userId: string, roleId: string, type: AuthType): string {
        return jwt.sign({
            roleId,
            type
        }, AUTH_SECRET_OR_PRIVATE_KEY, {
            subject: userId,
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
