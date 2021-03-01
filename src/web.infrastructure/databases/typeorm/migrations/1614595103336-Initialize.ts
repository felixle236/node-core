import { MigrationInterface, QueryRunner } from 'typeorm';
import { v4 } from 'uuid';
import { BUCKET_NAME } from '../../../../configs/Configuration';
import { Auth } from '../../../../web.core/domain/entities/auth/Auth';
import { Role } from '../../../../web.core/domain/entities/role/Role';
import { User } from '../../../../web.core/domain/entities/user/User';
import { AuthType } from '../../../../web.core/domain/enums/auth/AuthType';
import { RoleId } from '../../../../web.core/domain/enums/role/RoleId';
import { GenderType } from '../../../../web.core/domain/enums/user/GenderType';
import { UserStatus } from '../../../../web.core/domain/enums/user/UserStatus';
import { IRole } from '../../../../web.core/domain/types/role/IRole';
import { IUser } from '../../../../web.core/domain/types/user/IUser';
import { IAuthRepository } from '../../../../web.core/gateways/repositories/auth/IAuthRepository';
import { IRoleRepository } from '../../../../web.core/gateways/repositories/role/IRoleRepository';
import { IUserRepository } from '../../../../web.core/gateways/repositories/user/IUserRepository';
import { ILogService } from '../../../../web.core/gateways/services/ILogService';
import { IStorageService } from '../../../../web.core/gateways/services/IStorageService';
import { LogService } from '../../../services/log/LogService';
import { StorageService } from '../../../services/storage/StorageService';
import { AuthRepository } from '../repositories/auth/AuthRepository';
import { RoleRepository } from '../repositories/role/RoleRepository';
import { UserRepository } from '../repositories/user/UserRepository';

const logService: ILogService = new LogService();

export class Initialize1614595103336 implements MigrationInterface {
    name = 'Initialize1614595103336'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE "role" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_8457b7e62d5348ea4579f1bf45" ON "role" ("name") WHERE deleted_at IS NULL');
        await queryRunner.query('CREATE TYPE "users_status_enum" AS ENUM(\'inactive\', \'actived\', \'archived\')');
        await queryRunner.query('CREATE TYPE "users_gender_enum" AS ENUM(\'male\', \'female\')');
        await queryRunner.query('CREATE TABLE "users" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role_id" uuid NOT NULL, "status" "users_status_enum" NOT NULL DEFAULT \'actived\', "first_name" character varying(20) NOT NULL, "last_name" character varying(20), "email" character varying(120) NOT NULL, "avatar" character varying(200), "gender" "users_gender_enum", "birthday" date, "phone" character varying(20), "address" character varying(200), "culture" character varying(5), "currency" character varying(3), "active_key" character varying(64), "active_expire" TIMESTAMP WITH TIME ZONE, "actived_at" TIMESTAMP WITH TIME ZONE, "archived_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_b383987bfa6e6a8745085621d0" ON "users" ("email") WHERE deleted_at IS NULL');
        await queryRunner.query('CREATE TYPE "auth_type_enum" AS ENUM(\'personal_email\', \'personal_phone\')');
        await queryRunner.query('CREATE TABLE "auth" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "type" "auth_type_enum" NOT NULL, "username" character varying(120) NOT NULL, "password" character varying(32) NOT NULL, "forgot_key" character varying(64), "forgot_expire" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_7e416cf6172bc5aec04244f6459" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_968b36cde50de085eb4cbb9486" ON "auth" ("username") WHERE deleted_at IS NULL');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_4f6bf4f0ab35e68dfe3bc087e3" ON "auth" ("user_id", "type") WHERE deleted_at IS NULL');
        await queryRunner.query('ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "auth" ADD CONSTRAINT "FK_9922406dc7d70e20423aeffadf3" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');

        await initData(queryRunner);
        await initBucket();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "auth" DROP CONSTRAINT "FK_9922406dc7d70e20423aeffadf3"');
        await queryRunner.query('ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"');
        await queryRunner.query('DROP INDEX "IDX_4f6bf4f0ab35e68dfe3bc087e3"');
        await queryRunner.query('DROP INDEX "IDX_968b36cde50de085eb4cbb9486"');
        await queryRunner.query('DROP TABLE "auth"');
        await queryRunner.query('DROP TYPE "auth_type_enum"');
        await queryRunner.query('DROP INDEX "IDX_b383987bfa6e6a8745085621d0"');
        await queryRunner.query('DROP TABLE "users"');
        await queryRunner.query('DROP TYPE "users_gender_enum"');
        await queryRunner.query('DROP TYPE "users_status_enum"');
        await queryRunner.query('DROP INDEX "IDX_8457b7e62d5348ea4579f1bf45"');
        await queryRunner.query('DROP TABLE "role"');
    }
}

/**
 * Initialize data for Role, User.
 * @param queryRunner QueryRunner
 */
async function initData(queryRunner: QueryRunner): Promise<void> {
    const roleRepository: IRoleRepository = new RoleRepository();
    const userRepository: IUserRepository = new UserRepository();
    const authRepository: IAuthRepository = new AuthRepository();

    // Create roles

    let role = new Role({ id: RoleId.SUPER_ADMIN } as IRole);
    role.name = 'Super Admin';
    await roleRepository.create(role, queryRunner);

    role = new Role({ id: RoleId.MANAGER } as IRole);
    role.name = 'Manager';
    await roleRepository.create(role, queryRunner);

    role = new Role({ id: RoleId.CLIENT } as IRole);
    role.name = 'Client';
    await roleRepository.create(role, queryRunner);

    logService.info('\x1b[32m Create roles successfully. \x1b[0m');

    // Create user "Super Admin"

    const user = new User({ id: v4() } as IUser);
    user.roleId = RoleId.SUPER_ADMIN;
    user.status = UserStatus.ACTIVED;
    user.firstName = 'Super';
    user.lastName = 'Admin';
    user.email = 'admin@localhost.com';
    user.gender = GenderType.MALE;

    const auth = new Auth();
    auth.userId = user.id;
    auth.type = AuthType.PERSONAL_EMAIL;
    auth.username = user.email;
    auth.password = 'Nodecore@2';

    await userRepository.create(user, queryRunner);
    await authRepository.create(auth, queryRunner);

    logService.info('\x1b[32m Create user "Super Admin" successfully. \x1b[0m');
}

/**
 * Initialize bucket.
 */
async function initBucket(): Promise<void> {
    const storageService: IStorageService = new StorageService();
    /* eslint-disable */
    const policy = {
        Version: '2012-10-17',
        Statement: [{
            Sid: '',
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:GetBucketLocation'],
            Resource: [`arn:aws:s3:::${BUCKET_NAME}`]
        }, {
            Sid: '',
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:ListBucket'],
            Resource: [`arn:aws:s3:::${BUCKET_NAME}`],
            Condition: {
                StringEquals: {
                    's3:prefix': ['images/']
                }
            }
        }, {
            Sid: '',
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${BUCKET_NAME}/images/*`]
        }]
    };

    /* eslint-enable */
    await storageService.createBucket(JSON.stringify(policy));
    logService.info('\x1b[32m Create bucket successfully. \x1b[0m');
}
