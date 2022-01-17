import { ClientStatus } from 'domain/enums/user/ClientStatus';
import { AddressInfo } from 'domain/value-objects/AddressInfo';
import { User } from './User';

export class Client extends User {
  email: string;
  phone?: string;
  address?: AddressInfo;
  locale?: string;
  status: ClientStatus;
  activeKey?: string;
  activeExpire?: Date;
  activedAt?: Date;
  archivedAt?: Date;

  /* Relationship */

  /* Handlers */
}
