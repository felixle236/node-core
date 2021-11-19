/* eslint-disable @typescript-eslint/naming-convention */
import { createParamDecorator } from 'routing-controllers';
import { IRequest } from 'shared/request/IRequest';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';

/**
 * Usecase option generated decorator
 */
export function UsecaseOptionRequest(): (object: object, method: string, index: number) => void {
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
