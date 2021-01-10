import * as validator from 'class-validator';
import { Inject, Service } from 'typedi';
import { JwtAuthUserQuery } from './JwtAuthUserQuery';
import { AccessDeniedError } from '../../../../domain/common/exceptions/AccessDeniedError';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { UnauthorizedError } from '../../../../domain/common/exceptions/UnauthorizedError';
import { IQueryHandler } from '../../../../domain/common/usecase/interfaces/IQueryHandler';
import { UserAuthenticated } from '../../../../domain/common/UserAuthenticated';
import { IJwtAuthService } from '../../../../gateways/services/IJwtAuthService';

@Service()
export class JwtAuthUserQueryHandler implements IQueryHandler<JwtAuthUserQuery, UserAuthenticated> {
    @Inject('jwt.auth.service')
    private readonly _jwtAuthService: IJwtAuthService;

    async handle(param: JwtAuthUserQuery): Promise<UserAuthenticated> {
        if (!param.token)
            throw new UnauthorizedError(MessageError.PARAM_REQUIRED, 'token');

        if (!validator.isJWT(param.token))
            throw new UnauthorizedError(MessageError.PARAM_INVALID, 'token');

        let payload;
        try {
            payload = this._jwtAuthService.verify(param.token);
        }
        catch (error) {
            if (error.name === 'TokenExpiredError')
                throw new UnauthorizedError(MessageError.PARAM_EXPIRED, 'token');
            else
                throw new UnauthorizedError(MessageError.PARAM_INVALID, 'token');
        }

        if (!payload || !payload.sub || !payload.roleId)
            throw new UnauthorizedError(MessageError.PARAM_INVALID, 'token');

        if (param.roleIds && param.roleIds.length && !param.roleIds.find(roleId => roleId === payload.roleId))
            throw new AccessDeniedError();

        return new UserAuthenticated(param.token, payload.sub, payload.roleId);
    }
}
