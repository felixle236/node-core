import { Auth } from 'domain/entities/auth/Auth';
import { AuthType } from 'domain/enums/auth/AuthType';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { DbEntity } from '../../common/DbEntity';
import { AUTH_SCHEMA } from '../../schemas/auth/AuthSchema';
import { UserDb } from '../user/UserDb';

@Entity(AUTH_SCHEMA.TABLE_NAME)
@Index((authDb: AuthDb) => [authDb.userId, authDb.type], { unique: true, where: DbEntity.getIndexFilterDeletedColumn() })
export class AuthDb extends DbEntity<Auth> {
  constructor() {
    super(Auth);
  }

  @Column('uuid', { name: AUTH_SCHEMA.COLUMNS.USER_ID })
  userId: string;

  @Column('enum', { name: AUTH_SCHEMA.COLUMNS.TYPE, enum: AuthType })
  type: AuthType;

  @Column('varchar', { name: AUTH_SCHEMA.COLUMNS.USERNAME })
  @Index({ unique: true, where: DbEntity.getIndexFilterDeletedColumn() })
  username: string;

  @Column('varchar', { name: AUTH_SCHEMA.COLUMNS.PASSWORD })
  password: string;

  @Column('varchar', { name: AUTH_SCHEMA.COLUMNS.FORGOT_KEY, nullable: true })
  forgotKey?: string;

  @Column('timestamptz', { name: AUTH_SCHEMA.COLUMNS.FORGOT_EXPIRE, nullable: true })
  forgotExpire?: Date;

  /* Relationship */

  @ManyToOne(() => UserDb, (user) => user.auths, { createForeignKeyConstraints: false })
  @JoinColumn({ name: AUTH_SCHEMA.COLUMNS.USER_ID })
  user?: UserDb;

  /* Handlers */

  override toEntity(): Auth {
    const entity = super.toEntity();
    entity.userId = this.userId;
    entity.type = this.type;
    entity.username = this.username;
    entity.password = this.password;
    entity.forgotKey = this.forgotKey;
    entity.forgotExpire = this.forgotExpire;

    /* Relationship */

    if (this.user) {
      entity.user = this.user.toEntity();
    }

    return entity;
  }

  override fromEntity(entity: Auth): void {
    super.fromEntity(entity);

    this.userId = entity.userId;
    this.type = entity.type;
    this.username = entity.username;
    this.password = entity.password;
    this.forgotKey = entity.forgotKey;
    this.forgotExpire = entity.forgotExpire;
  }
}
