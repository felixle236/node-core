import { GetUserAuthByJwtQueryHandler } from '@usecases/auth/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQueryHandler';
import { GetUserAuthByJwtQueryData, GetUserAuthByJwtQueryOutput } from '@usecases/auth/auth/queries/get-user-auth-by-jwt/GetUserAuthByJwtQueryOutput';
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
