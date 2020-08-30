import { Filter } from '../../../../domain/common/interactor/Filter';
import { IsBoolean } from 'class-validator';
import { UserStatus } from '../../../../domain/enums/UserStatus';

export class FindUserQuery extends Filter {
    keyword?: string;
    roleId?: string;
    status?: UserStatus;

    @IsBoolean()
    isBirthdayNearly?: boolean;

    roleAuthLevel: number;
}
