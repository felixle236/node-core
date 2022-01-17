import { randomUUID } from 'crypto';
import { Auth } from 'domain/entities/auth/Auth';
import { Manager } from 'domain/entities/user/Manager';
import { AuthType } from 'domain/enums/auth/AuthType';
import { GenderType } from 'domain/enums/user/GenderType';
import { ManagerStatus } from 'domain/enums/user/ManagerStatus';
import { RoleId } from 'domain/enums/user/RoleId';
import { IAuthRepository } from 'application/interfaces/repositories/auth/IAuthRepository';
import { IManagerRepository } from 'application/interfaces/repositories/user/IManagerRepository';
import { STORAGE_BUCKET_NAME, STORAGE_PROVIDER } from 'config/Configuration';
import { LogService } from 'infras/services/log/LogService';
import { StorageService } from 'infras/services/storage/StorageService';
import { StorageProvider } from 'shared/types/Environment';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { AuthRepository } from '../repositories/auth/AuthRepository';
import { ManagerRepository } from '../repositories/user/ManagerRepository';

const logService = new LogService();
const storageService = new StorageService();

/**
 * Initialize data for Role, User.
 * @param queryRunner QueryRunner
 */
async function initData(queryRunner: QueryRunner): Promise<void> {
  const managerRepository: IManagerRepository = new ManagerRepository();
  const authRepository: IAuthRepository = new AuthRepository();

  // Create user "Super Admin"

  const manager = new Manager();
  manager.id = randomUUID();
  manager.roleId = RoleId.SuperAdmin;
  manager.status = ManagerStatus.Actived;
  manager.firstName = 'Super';
  manager.lastName = 'Admin';
  manager.email = 'admin@localhost.com';
  manager.gender = GenderType.Male;

  const auth = new Auth();
  auth.type = AuthType.PersonalEmail;
  auth.userId = manager.id;
  auth.username = manager.email;
  auth.password = Auth.hashPassword('Nodecore@2');

  await managerRepository.create(manager, queryRunner);
  await authRepository.create(auth, queryRunner);

  logService.info('\x1b[32m Create user "Super Admin" successfully. \x1b[0m');
}

/**
 * Initialize bucket.
 */
async function initBucket(): Promise<void> {
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

export class Initialize1639016247061 implements MigrationInterface {
  name = 'Initialize1639016247061';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "role_id" uuid NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying, "avatar" character varying, "gender" character varying, "birthday" date, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))',
    );
    await queryRunner.query('CREATE INDEX "IDX_a2cecd1a3531c0b041e29ba46e" ON "users" ("role_id") ');
    await queryRunner.query('CREATE TYPE "public"."auth_type_enum" AS ENUM(\'personal_email\', \'personal_phone\')');
    await queryRunner.query(
      'CREATE TABLE "auth" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid NOT NULL, "type" "public"."auth_type_enum" NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "forgot_key" character varying, "forgot_expire" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_7e416cf6172bc5aec04244f6459" PRIMARY KEY ("id"))',
    );
    await queryRunner.query('CREATE UNIQUE INDEX "IDX_968b36cde50de085eb4cbb9486" ON "auth" ("username") WHERE deleted_at IS NULL');
    await queryRunner.query('CREATE UNIQUE INDEX "IDX_4f6bf4f0ab35e68dfe3bc087e3" ON "auth" ("user_id", "type") WHERE deleted_at IS NULL');
    await queryRunner.query("CREATE TYPE \"public\".\"client_status_enum\" AS ENUM('inactived', 'actived', 'archived')");
    await queryRunner.query(
      'CREATE TABLE "client" ("email" character varying NOT NULL, "phone" character varying, "address" jsonb, "locale" character varying, "status" "public"."client_status_enum" NOT NULL DEFAULT \'actived\', "active_key" character varying, "active_expire" TIMESTAMP WITH TIME ZONE, "actived_at" TIMESTAMP WITH TIME ZONE, "archived_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY ("id")) INHERITS ("users")',
    );
    await queryRunner.query('CREATE INDEX "IDX_ea545365f74ddd2a7ed1fd4263" ON "client" ("role_id") ');
    await queryRunner.query('CREATE UNIQUE INDEX "IDX_6376cac90cf2c7378f369a271c" ON "client" ("email") WHERE deleted_at IS NULL');
    await queryRunner.query('CREATE TYPE "public"."manager_status_enum" AS ENUM(\'actived\', \'archived\')');
    await queryRunner.query(
      'CREATE TABLE "manager" ("email" character varying NOT NULL, "status" "public"."manager_status_enum" NOT NULL DEFAULT \'actived\', "archived_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_b3ac840005ee4ed76a7f1c51d01" PRIMARY KEY ("id")) INHERITS ("users")',
    );
    await queryRunner.query('CREATE INDEX "IDX_67b47d76acd361b2f702095190" ON "manager" ("role_id") ');
    await queryRunner.query('CREATE UNIQUE INDEX "IDX_c94753b4da020c90870ab40b7a" ON "manager" ("email") WHERE deleted_at IS NULL');

    await initData(queryRunner);
    if ([StorageProvider.MinIO, StorageProvider.AwsS3].includes(STORAGE_PROVIDER)) {
      await initBucket();
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "public"."IDX_c94753b4da020c90870ab40b7a"');
    await queryRunner.query('DROP INDEX "public"."IDX_67b47d76acd361b2f702095190"');
    await queryRunner.query('DROP TABLE "manager"');
    await queryRunner.query('DROP TYPE "public"."manager_status_enum"');
    await queryRunner.query('DROP INDEX "public"."IDX_6376cac90cf2c7378f369a271c"');
    await queryRunner.query('DROP INDEX "public"."IDX_ea545365f74ddd2a7ed1fd4263"');
    await queryRunner.query('DROP TABLE "client"');
    await queryRunner.query('DROP TYPE "public"."client_status_enum"');
    await queryRunner.query('DROP INDEX "public"."IDX_4f6bf4f0ab35e68dfe3bc087e3"');
    await queryRunner.query('DROP INDEX "public"."IDX_968b36cde50de085eb4cbb9486"');
    await queryRunner.query('DROP TABLE "auth"');
    await queryRunner.query('DROP TYPE "public"."auth_type_enum"');
    await queryRunner.query('DROP INDEX "public"."IDX_a2cecd1a3531c0b041e29ba46e"');
    await queryRunner.query('DROP TABLE "users"');
  }
}
