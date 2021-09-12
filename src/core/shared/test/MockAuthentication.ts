import { randomUUID } from 'crypto';
import { IJwtPayloadExtend } from '@gateways/services/IAuthJwtService';
import { GetUserAuthByJwtQueryHandler } from '@usecases/auth/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQueryHandler';
import { GetUserAuthByJwtQueryData, GetUserAuthByJwtQueryOutput } from '@usecases/auth/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQueryOutput';
import jwt from 'jsonwebtoken';
import { Container } from 'typedi';
import { mockAuthJwtService } from './MockAuthJwtService';
import { mockLogService } from './MockLogService';

export const mockAuthentication = (data: GetUserAuthByJwtQueryData): void => {
    Container.set('auth_jwt.service', mockAuthJwtService());
    Container.set('log.service', mockLogService());

    const userAuth = new GetUserAuthByJwtQueryOutput();
    userAuth.setData(data);
    Container.set(GetUserAuthByJwtQueryHandler, {
        async handle() {
            return userAuth;
        }
    });
};

export const mockJwtToken = (subject = randomUUID(), secretOrPrivateKey = '123456'): string => {
    return jwt.sign({}, secretOrPrivateKey, {
        subject,
        expiresIn: 60,
        algorithm: 'HS256'
    } as jwt.SignOptions);
};

export const mockVerifyJwtToken = (token: string, secretOrPrivateKey = '123456'): IJwtPayloadExtend => {
    return jwt.verify(token, secretOrPrivateKey, {
        algorithm: 'HS256'
    } as jwt.VerifyOptions) as IJwtPayloadExtend;
};
