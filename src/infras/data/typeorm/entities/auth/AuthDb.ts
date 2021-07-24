import { AUTH_SCHEMA } from '@data/typeorm/schemas/auth/AuthSchema';
import { Auth } from '@domain/entities/auth/Auth';
import { AuthType } from '@domain/enums/auth/AuthType';
import { IAuth } from '@domain/interfaces/auth/IAuth';
import { IUser } from '@domain/interfaces/user/IUser';
import { Column, Entity, Index, JoinColumn } from 'typeorm';
import { BaseDbEntity } from '../base/BaseDBEntity';

@Entity(AUTH_SCHEMA.TABLE_NAME)
@Index((authDb: AuthDb) => [authDb.userId, authDb.type], { unique: true, where: BaseDbEntity.getIndexFilterDeletedColumn() })
export class AuthDb extends BaseDbEntity<string, Auth> implements IAuth {
    @Column('uuid', { name: AUTH_SCHEMA.COLUMNS.USER_ID })
    userId: string;

    @Column('enum', { name: AUTH_SCHEMA.COLUMNS.TYPE, enum: AuthType })
    type: AuthType;

    @Column('varchar', { name: AUTH_SCHEMA.COLUMNS.USERNAME, length: 120 })
    @Index({ unique: true, where: BaseDbEntity.getIndexFilterDeletedColumn() })
    username: string;

    @Column('varchar', { name: AUTH_SCHEMA.COLUMNS.PASSWORD, length: 32 })
    password: string;

    @Column('varchar', { name: AUTH_SCHEMA.COLUMNS.FORGOT_KEY, length: 64, nullable: true })
    forgotKey: string | null;

    @Column('timestamptz', { name: AUTH_SCHEMA.COLUMNS.FORGOT_EXPIRE, nullable: true })
    forgotExpire: Date | null;

    /* Relationship */

    @JoinColumn({ name: AUTH_SCHEMA.COLUMNS.USER_ID })
    user: IUser | null;

    /* Handlers */

    toEntity(): Auth {
        return new Auth(this);
    }

    fromEntity(entity: Auth): IAuth {
        return entity.toData();
    }
}
