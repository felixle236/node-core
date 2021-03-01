import * as validator from 'class-validator';
import { Inject, Service } from 'typedi';
import { GetUserAuthByJwtQuery } from './GetUserAuthByJwtQuery';
import { AccessDeniedError } from '../../../../domain/common/exceptions/AccessDeniedError';
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { UnauthorizedError } from '../../../../domain/common/exceptions/UnauthorizedError';
import { IQueryHandler } from '../../../../domain/common/usecase/interfaces/IQueryHandler';
import { UserAuthenticated } from '../../../../domain/common/UserAuthenticated';
import { IAuthJwtService } from '../../../../gateways/services/IAuthJwtService';

@Service()
export class GetUserAuthByJwtQueryHandler implements IQueryHandler<GetUserAuthByJwtQuery, UserAuthenticated> {
    @Inject('auth_jwt.service')
    private readonly _authJwtService: IAuthJwtService;

    async handle(param: GetUserAuthByJwtQuery): Promise<UserAuthenticated> {
        if (!param.token)
            throw new UnauthorizedError(MessageError.PARAM_REQUIRED, 'token');

        if (!validator.isJWT(param.token))
            throw new UnauthorizedError(MessageError.PARAM_INVALID, 'token');

        let payload;
        try {
            payload = this._authJwtService.verify(param.token);
        }
        catch (error) {
            if (error.name === 'TokenExpiredError')
                throw new UnauthorizedError(MessageError.PARAM_EXPIRED, 'token');
            else
                throw new UnauthorizedError(MessageError.PARAM_INVALID, 'token');
        }

        if (!payload || !payload.sub || !payload.roleId)
            throw new UnauthorizedError(MessageError.PARAM_INVALID, 'token payload');

        if (param.roleIds && param.roleIds.length && !param.roleIds.find(roleId => roleId === payload.roleId))
            throw new AccessDeniedError();

        return new UserAuthenticated(param.token, payload.sub, payload.roleId);
    }
}
