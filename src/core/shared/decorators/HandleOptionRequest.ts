/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/naming-convention */
import { IRequest } from '@shared/request/IRequest';
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
            handleOption.trace = reqExt.trace;
            handleOption.userAuth = reqExt.userAuth;
            return handleOption;
        }
    });
}
