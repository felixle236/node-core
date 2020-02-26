import * as jwt from 'jsonwebtoken';
import { AUTH_SECRET_OR_PRIVATE_KEY, AUTH_SECRET_OR_PUBLIC_KEY, AUTH_SIGNATURE, DOMAIN, PROJECT_NAME, PROTOTYPE } from '../../constants/Environments';
import { IAuthenticationService, IJwtPayloadExtend } from '../../web.core/interfaces/gateways/auth/IAuthenticationService';
import { IUser } from '../../web.core/interfaces/models/IUser';
import { Service } from 'typedi';

@Service('authentication.service')
export class AuthenticationService implements IAuthenticationService {
    sign(user: IUser): string {
        return jwt.sign({
            roleId: user.roleId
        }, AUTH_SECRET_OR_PRIVATE_KEY, {
            subject: user.id.toString(),
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
