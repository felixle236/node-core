import { UserStatus } from '../../../../constants/Enums';

export class UserActiveData {
    status: UserStatus;
    activeKey?: string;
    activeExpire?: Date;
    activedAt?: Date;
}
