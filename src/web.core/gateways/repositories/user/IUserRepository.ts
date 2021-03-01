import { DbPagination } from '../../../domain/common/database/DbPagination';
import { IBaseRepository } from '../../../domain/common/database/interfaces/IBaseRepository';
import { IDbQueryRunner } from '../../../domain/common/database/interfaces/IDbQueryRunner';
import { User } from '../../../domain/entities/user/User';
import { UserStatus } from '../../../domain/enums/user/UserStatus';

export class FindUserFilter extends DbPagination {
    keyword: string | null;
    roleIds: string[] | null;
    status: UserStatus | null;
    isBirthdayNearly: boolean | null;
}

export interface IUserRepository extends IBaseRepository<User, string> {
    findAndCount(param: FindUserFilter): Promise<[User[], number]>;

    getByEmail(email: string): Promise<User | null>;

    checkEmailExist(email: string): Promise<boolean>;
    checkEmailExist(email: string, queryRunner: IDbQueryRunner): Promise<boolean>;
}
