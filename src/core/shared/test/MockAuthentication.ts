import { randomUUID } from 'crypto';
import { IAuthJwtService, IJwtPayloadExtend } from '@gateways/services/IAuthJwtService';
import { GetUserAuthByJwtHandler } from '@usecases/auth/auth/get-user-auth-by-jwt/GetUserAuthByJwtHandler';
import { GetUserAuthByJwtData, GetUserAuthByJwtOutput } from '@usecases/auth/auth/get-user-auth-by-jwt/GetUserAuthByJwtOutput';
import jwt from 'jsonwebtoken';
import { SinonSandbox } from 'sinon';
import { Container } from 'typedi';
import { mockAuthJwtService } from './MockAuthJwtService';
import { mockLogService } from './MockLogService';

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

export const mockUserAuthentication = (sandbox: SinonSandbox, data: { userId: string, roleId: string }): void => {
    const authJwtService: IAuthJwtService = mockAuthJwtService();
    sandbox.stub(authJwtService, 'getTokenFromHeader').returns(mockJwtToken());
    Container.set('auth_jwt.service', authJwtService);
    Container.set('log.service', mockLogService());

    const userAuthData = new GetUserAuthByJwtData();
    userAuthData.roleId = data.roleId;
    userAuthData.userId = data.userId;

    const userAuth = new GetUserAuthByJwtOutput();
    userAuth.data = userAuthData;

    Container.set(GetUserAuthByJwtHandler, {
        async handle() {
            return userAuth;
        }
    });
};
