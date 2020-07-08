import { UserStatus } from '../../../../constants/Enums';

export class UserArchiveData {
    status: UserStatus;
    archivedAt?: Date;
}
