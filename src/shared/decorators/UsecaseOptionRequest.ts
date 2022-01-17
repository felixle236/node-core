/* eslint-disable @typescript-eslint/naming-convention */
import { Request } from 'express';
import { createParamDecorator } from 'routing-controllers';
import { UsecaseOption } from 'shared/usecase/UsecaseOption';

/**
 * Usecase option generated decorator
 */
export function UsecaseOptionRequest(): (object: object, method: string, index: number) => void {
  return createParamDecorator({
    required: true,
    value: (actionProperties) => {
      const req = actionProperties.request as Request;
      const usecaseOption = new UsecaseOption();
      usecaseOption.req = req;
      usecaseOption.res = actionProperties.response;
      usecaseOption.locale = req.locale;
      usecaseOption.trace = req.trace;
      usecaseOption.userAuth = req.userAuth;
      return usecaseOption;
    },
  });
}
