import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Auth } from '../../../../../web.core/domain/entities/auth/Auth';
import { AuthType } from '../../../../../web.core/domain/enums/auth/AuthType';
import { IAuth } from '../../../../../web.core/domain/types/auth/IAuth';
import { IUser } from '../../../../../web.core/domain/types/user/IUser';
import { AUTH_SCHEMA } from '../../schemas/auth/AuthSchema';
import { BaseDbEntity } from '../base/BaseDBEntity';
import { UserDb } from '../user/UserDb';

@Entity(AUTH_SCHEMA.TABLE_NAME)
@Index((authDb: AuthDb) => [authDb.userId, authDb.type], { unique: true, where: BaseDbEntity.getIndexFilterDeletedColumn() })
export class AuthDb extends BaseDbEntity<Auth> implements IAuth {
    @PrimaryGeneratedColumn('uuid', { name: AUTH_SCHEMA.COLUMNS.ID })
    id: string;

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

    @ManyToOne(() => UserDb, user => user.auths)
    @JoinColumn({ name: AUTH_SCHEMA.COLUMNS.USER_ID })
    user: IUser | null;

    /* Handlers */

    toEntity(): Auth {
        return new Auth(this);
    }

    fromEntity(entity: Auth) {
        return entity.toData();
    }
}
