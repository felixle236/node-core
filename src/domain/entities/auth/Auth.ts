import { Entity } from 'domain/common/Entity';
import { AuthType } from 'domain/enums/auth/AuthType';
import { LogicalError } from 'shared/exceptions/LogicalError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { hashMD5 } from 'utils/Crypt';
import { User } from '../user/User';

export class Auth extends Entity {
  userId: string;
  type: AuthType;
  username: string;
  password: string;
  forgotKey?: string;
  forgotExpire?: Date;

  /* Relationship */

  user?: User;

  /* Handlers */

  static validatePassword(password: string): void {
    const regExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()-_=+[{\]}\\|;:'",<.>/?]).{8,20}$/;
    if (!regExp.test(password)) {
      throw new LogicalError(MessageError.PARAM_LEN_AT_LEAST_AND_MAX_SPECIAL, { t: 'password' }, 6, 20);
    }
  }

  static hashPassword(password: string): string {
    return hashMD5(password, '$$');
  }
}
