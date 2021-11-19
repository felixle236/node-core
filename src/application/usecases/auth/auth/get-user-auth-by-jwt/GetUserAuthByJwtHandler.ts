import { IAuthJwtService, IJwtPayloadExtend } from 'application/interfaces/services/IAuthJwtService';
import { ILogService } from 'application/interfaces/services/ILogService';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { SystemError } from 'shared/exceptions/SystemError';
import { UnauthorizedError } from 'shared/exceptions/UnauthorizedError';
import { InjectService } from 'shared/types/Injection';
import { IUsecaseHandler } from 'shared/usecase/interfaces/IUsecaseHandler';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';
import { Inject, Service } from 'typedi';
import { GetUserAuthByJwtData, GetUserAuthByJwtOutput } from './GetUserAuthByJwtOutput';

@Service()
export class GetUserAuthByJwtHandler implements IUsecaseHandler<string, GetUserAuthByJwtOutput> {
    constructor(
        @Inject(InjectService.AuthJwt) private readonly _authJwtService: IAuthJwtService,
        @Inject(InjectService.Log) private readonly _logService: ILogService
    ) {}

    async handle(token: string, usecaseOption: UsecaseOption): Promise<GetUserAuthByJwtOutput> {
        if (!token)
            throw new SystemError(MessageError.PARAM_REQUIRED, { t: 'token' });

        let payload: IJwtPayloadExtend;
        try {
            payload = this._authJwtService.verify(token);
        }
        catch (error: any) {
            this._logService.error('Verify token', error, usecaseOption.trace.id);
            if (error.name === 'TokenExpiredError')
                throw new UnauthorizedError(MessageError.PARAM_EXPIRED, { t: 'token' });
            else
                throw new UnauthorizedError(MessageError.PARAM_INVALID, { t: 'token' });
        }

        if (!payload || !payload.userId || !payload.roleId || !payload.type)
            throw new UnauthorizedError(MessageError.PARAM_INVALID, { t: 'token_payload' });

        const result = new GetUserAuthByJwtOutput();
        result.data = new GetUserAuthByJwtData();
        result.data.userId = payload.userId;
        result.data.roleId = payload.roleId;
        result.data.type = payload.type;
        return result;
    }
}
