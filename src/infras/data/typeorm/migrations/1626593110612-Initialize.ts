import { STORAGE_BUCKET_NAME } from '@configs/Configuration';
import { Auth } from '@domain/entities/auth/Auth';
import { Manager } from '@domain/entities/user/Manager';
import { AuthType } from '@domain/enums/auth/AuthType';
import { GenderType } from '@domain/enums/user/GenderType';
import { ManagerStatus } from '@domain/enums/user/ManagerStatus';
import { RoleId } from '@domain/enums/user/RoleId';
import { IManager } from '@domain/interfaces/user/IManager';
import { IAuthRepository } from '@gateways/repositories/auth/IAuthRepository';
import { IManagerRepository } from '@gateways/repositories/user/IManagerRepository';
import { ILogService } from '@gateways/services/ILogService';
import { IStorageService } from '@gateways/services/IStorageService';
import { LogService } from '@services/log/LogService';
import { StorageService } from '@services/storage/StorageService';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { v4 } from 'uuid';
import { AuthRepository } from '../repositories/auth/AuthRepository';
import { ManagerRepository } from '../repositories/user/ManagerRepository';

const logService: ILogService = new LogService();

/**
 * Initialize data for Role, User.
 * @param queryRunner QueryRunner
 */
async function initData(queryRunner: QueryRunner): Promise<void> {
    const managerRepository: IManagerRepository = new ManagerRepository();
    const authRepository: IAuthRepository = new AuthRepository();

    // Create user "Super Admin"

    const manager = new Manager({ id: v4() } as IManager);
    manager.roleId = RoleId.SUPER_ADMIN;
    manager.status = ManagerStatus.ACTIVED;
    manager.firstName = 'Super';
    manager.lastName = 'Admin';
    manager.email = 'admin@localhost.com';
    manager.gender = GenderType.MALE;

    const auth = new Auth();
    auth.type = AuthType.PERSONAL_EMAIL;
    auth.userId = manager.id;
    auth.username = manager.email;
    auth.password = 'Nodecore@2';

    await managerRepository.create(manager, queryRunner);
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
            Resource: [`arn:aws:s3:::${STORAGE_BUCKET_NAME}`]
        }, {
            Sid: '',
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:ListBucket'],
            Resource: [`arn:aws:s3:::${STORAGE_BUCKET_NAME}`],
            Condition: {
                StringEquals: {
                    's3:prefix': [
                        'users/'
                    ]
                }
            }
        }, {
            Sid: '',
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:GetObject'],
            Resource: [
                `arn:aws:s3:::${STORAGE_BUCKET_NAME}/users/*`
            ]
        }]
    };

    /* eslint-enable */
    await storageService.createBucket(JSON.stringify(policy));
    logService.info('\x1b[32m Create bucket successfully. \x1b[0m');
}

export class Initialize1626593110612 implements MigrationInterface {
    name = 'Initialize1626593110612'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "role_id" uuid NOT NULL, "first_name" character varying(20) NOT NULL, "last_name" character varying(20), "avatar" character varying(200), "gender" character varying(6), "birthday" date, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE INDEX "IDX_a2cecd1a3531c0b041e29ba46e" ON "users" ("role_id") ');
        await queryRunner.query('CREATE TYPE "auth_type_enum" AS ENUM(\'personal_email\', \'personal_phone\')');
        await queryRunner.query('CREATE TABLE "auth" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid NOT NULL, "type" "auth_type_enum" NOT NULL, "username" character varying(120) NOT NULL, "password" character varying(32) NOT NULL, "forgot_key" character varying(64), "forgot_expire" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_7e416cf6172bc5aec04244f6459" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_968b36cde50de085eb4cbb9486" ON "auth" ("username") WHERE deleted_at IS NULL');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_4f6bf4f0ab35e68dfe3bc087e3" ON "auth" ("user_id", "type") WHERE deleted_at IS NULL');
        await queryRunner.query('CREATE TYPE "client_gender_enum" AS ENUM(\'male\', \'female\')');
        await queryRunner.query('CREATE TYPE "client_status_enum" AS ENUM(\'inactived\', \'actived\', \'archived\')');
        await queryRunner.query('CREATE TABLE "client" ("email" character varying(120) NOT NULL, "phone" character varying(20), "address" character varying(200), "locale" character varying(5), "status" "client_status_enum" NOT NULL DEFAULT \'actived\', "active_key" character varying(64), "active_expire" TIMESTAMP WITH TIME ZONE, "actived_at" TIMESTAMP WITH TIME ZONE, "archived_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY ("id")) INHERITS ("users")');
        await queryRunner.query('CREATE INDEX "IDX_ea545365f74ddd2a7ed1fd4263" ON "client" ("role_id") ');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_6376cac90cf2c7378f369a271c" ON "client" ("email") WHERE deleted_at IS NULL');
        await queryRunner.query('CREATE TYPE "manager_gender_enum" AS ENUM(\'male\', \'female\')');
        await queryRunner.query('CREATE TYPE "manager_status_enum" AS ENUM(\'actived\', \'archived\')');
        await queryRunner.query('CREATE TABLE "manager" ("email" character varying(120) NOT NULL, "status" "manager_status_enum" NOT NULL DEFAULT \'actived\', "archived_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_b3ac840005ee4ed76a7f1c51d01" PRIMARY KEY ("id")) INHERITS ("users")');
        await queryRunner.query('CREATE INDEX "IDX_67b47d76acd361b2f702095190" ON "manager" ("role_id") ');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_c94753b4da020c90870ab40b7a" ON "manager" ("email") WHERE deleted_at IS NULL');

        await initData(queryRunner);
        await initBucket();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP INDEX "IDX_c94753b4da020c90870ab40b7a"');
        await queryRunner.query('DROP INDEX "IDX_67b47d76acd361b2f702095190"');
        await queryRunner.query('DROP TABLE "manager"');
        await queryRunner.query('DROP TYPE "manager_status_enum"');
        await queryRunner.query('DROP TYPE "manager_gender_enum"');
        await queryRunner.query('DROP INDEX "IDX_6376cac90cf2c7378f369a271c"');
        await queryRunner.query('DROP INDEX "IDX_ea545365f74ddd2a7ed1fd4263"');
        await queryRunner.query('DROP TABLE "client"');
        await queryRunner.query('DROP TYPE "client_status_enum"');
        await queryRunner.query('DROP TYPE "client_gender_enum"');
        await queryRunner.query('DROP INDEX "IDX_4f6bf4f0ab35e68dfe3bc087e3"');
        await queryRunner.query('DROP INDEX "IDX_968b36cde50de085eb4cbb9486"');
        await queryRunner.query('DROP TABLE "auth"');
        await queryRunner.query('DROP TYPE "auth_type_enum"');
        await queryRunner.query('DROP INDEX "IDX_a2cecd1a3531c0b041e29ba46e"');
        await queryRunner.query('DROP TABLE "users"');
    }
}
