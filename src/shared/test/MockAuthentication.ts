import { randomUUID } from 'crypto';
import { IAuthJwtService } from 'application/interfaces/services/IAuthJwtService';
import { ILogService } from 'application/interfaces/services/ILogService';
import { GetUserAuthByJwtHandler } from 'application/usecases/auth/auth/get-user-auth-by-jwt/GetUserAuthByJwtHandler';
import { GetUserAuthByJwtData, GetUserAuthByJwtOutput } from 'application/usecases/auth/auth/get-user-auth-by-jwt/GetUserAuthByJwtOutput';
import jwt from 'jsonwebtoken';
import { InjectService } from 'shared/types/Injection';
import { SinonSandbox } from 'sinon';
import { mockAuthJwtService } from './MockAuthJwtService';
import { mockInjection } from './MockInjection';
import { mockLogService } from './MockLogService';

export const mockJwtToken = (userId = randomUUID(), roleId = randomUUID()): string => {
  return jwt.sign(
    {
      userId,
      roleId,
    },
    '123456',
    {
      subject: 'user_auth',
      expiresIn: 60,
      algorithm: 'HS256',
    } as jwt.SignOptions,
  );
};

export const mockUserAuthentication = (sandbox: SinonSandbox, data: { userId: string; roleId: string }): void => {
  const token = mockJwtToken(data.userId, data.roleId);
  const logService = mockInjection<ILogService>(InjectService.Log, mockLogService());
  const authJwtService = mockInjection<IAuthJwtService>(InjectService.AuthJwt, mockAuthJwtService());
  sandbox.stub(authJwtService, 'getTokenFromHeader').returns(token);
  const getUserAuthByJwtHandler = new GetUserAuthByJwtHandler(authJwtService, logService);
  mockInjection(GetUserAuthByJwtHandler, getUserAuthByJwtHandler);

  const userAuthData = new GetUserAuthByJwtData();
  userAuthData.roleId = data.roleId;
  userAuthData.userId = data.userId;

  const userAuth = new GetUserAuthByJwtOutput();
  userAuth.data = userAuthData;
  sandbox.stub(getUserAuthByJwtHandler, 'handle').resolves(userAuth);
};
