import { IAuthJwtService } from '@gateways/services/IAuthJwtService';
import { ILogService } from '@gateways/services/ILogService';
import { MessageError } from '@shared/exceptions/message/MessageError';
import { UnauthorizedError } from '@shared/exceptions/UnauthorizedError';
import { HandleOption } from '@shared/usecase/HandleOption';
import { QueryHandler } from '@shared/usecase/QueryHandler';
import { validateDataInput } from '@utils/validator';
import { Inject, Service } from 'typedi';
import { GetUserAuthByJwtQueryInput } from './GetUserAuthByJwtQueryInput';
import { GetUserAuthByJwtQueryOutput } from './GetUserAuthByJwtQueryOutput';

@Service()
export class GetUserAuthByJwtQueryHandler extends QueryHandler<GetUserAuthByJwtQueryInput, GetUserAuthByJwtQueryOutput> {
    @Inject('auth_jwt.service')
    private readonly _authJwtService: IAuthJwtService;

    @Inject('log.service')
    private readonly _logService: ILogService;

    async handle(param: GetUserAuthByJwtQueryInput, handleOption: HandleOption): Promise<GetUserAuthByJwtQueryOutput> {
        await validateDataInput(param);

        let payload;
        try {
            payload = this._authJwtService.verify(param.token);
        }
        catch (error: any) {
            this._logService.error('Verify token', error, handleOption.trace.id);
            if (error.name === 'TokenExpiredError')
                throw new UnauthorizedError(MessageError.PARAM_EXPIRED, 'token');
            else
                throw new UnauthorizedError(MessageError.PARAM_INVALID, 'token');
        }

        if (!payload || !payload.sub || !payload.roleId || !payload.type)
            throw new UnauthorizedError(MessageError.PARAM_INVALID, 'token payload');

        const result = new GetUserAuthByJwtQueryOutput();
        result.setData({
            userId: payload.sub,
            roleId: payload.roleId,
            type: payload.type
        });
        return result;
    }
}
