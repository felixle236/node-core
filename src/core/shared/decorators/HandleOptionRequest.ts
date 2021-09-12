/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/naming-convention */
import { IRequest } from '@shared/IRequest';
import { HandleOption } from '@shared/usecase/HandleOption';
import { createParamDecorator } from 'routing-controllers';

/**
 * Handle option generated decorator
 */
export function HandleOptionRequest(): Function {
    return createParamDecorator({
        required: true,
        value: actionProperties => {
            const reqExt = actionProperties.request as IRequest;
            const handleOption = new HandleOption();
            handleOption.userAuth = reqExt.userAuth;
            handleOption.trace = reqExt.getTraceHeader();
            return handleOption;
        }
    });
}
