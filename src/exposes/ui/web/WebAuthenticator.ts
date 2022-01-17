import { Request } from 'express';
import { Action } from 'routing-controllers';
import { UserAuthenticated } from 'shared/request/UserAuthenticated';

export class WebAuthenticator {
  static authorizationChecker = async (action: Action, roleIds: string[]): Promise<boolean> => {
    const req = action.request as Request;
    if (!req.userAuth || (roleIds && roleIds.length && !roleIds.some((roleId) => req.userAuth && roleId === req.userAuth.roleId))) {
      return action.response.status(301).redirect('/');
    }
    return true;
  };

  static currentUserChecker = (action: Action): UserAuthenticated | undefined => {
    const req = action.request as Request;
    return req.userAuth;
  };
}
