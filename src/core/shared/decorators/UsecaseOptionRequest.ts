/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/naming-convention */
import { IRequest } from '@shared/request/IRequest';
import { UsecaseOption } from '@shared/usecase/UsecaseOption';
import { createParamDecorator } from 'routing-controllers';

/**
 * Usecase option generated decorator
 */
export function UsecaseOptionRequest(): Function {
    return createParamDecorator({
        required: true,
        value: actionProperties => {
            const reqExt = actionProperties.request as IRequest;
            const usecaseOption = new UsecaseOption();
            usecaseOption.req = reqExt;
            usecaseOption.res = actionProperties.response;
            usecaseOption.trace = reqExt.trace;
            usecaseOption.userAuth = reqExt.userAuth;
            return usecaseOption;
        }
    });
}
