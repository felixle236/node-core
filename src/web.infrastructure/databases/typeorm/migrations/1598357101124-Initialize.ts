import { MigrationInterface, QueryRunner } from 'typeorm';
import { BUCKET_NAME } from '../../../../configs/Configuration';
import { GenderType } from '../../../../web.core/domain/enums/GenderType';
import { IRole } from '../../../../web.core/domain/types/IRole';
import { IRoleRepository } from '../../../../web.core/gateways/repositories/IRoleRepository';
import { IStorageService } from '../../../../web.core/gateways/services/IStorageService';
import { IUserRepository } from '../../../../web.core/gateways/repositories/IUserRepository';
import { Role } from '../../../../web.core/domain/entities/Role';
import { RoleId } from '../../../../web.core/domain/enums/RoleId';
import { RoleRepository } from '../repositories/RoleRepository';
import { StorageService } from '../../../services/storage/StorageService';
import { User } from '../../../../web.core/domain/entities/User';
import { UserRepository } from '../repositories/UserRepository';
import { UserStatus } from '../../../../web.core/domain/enums/UserStatus';

export class Initialize1598357101124 implements MigrationInterface {
    name = 'Initialize1598357101124'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TYPE "users_status_enum" AS ENUM(\'inactive\', \'actived\', \'archived\')');
        await queryRunner.query('CREATE TYPE "users_gender_enum" AS ENUM(\'male\', \'female\')');
        await queryRunner.query('CREATE TABLE "users" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role_id" uuid NOT NULL, "status" "users_status_enum" NOT NULL DEFAULT \'inactive\', "first_name" character varying(20) NOT NULL, "last_name" character varying(20), "email" character varying(120) NOT NULL, "password" character varying(32) NOT NULL, "avatar" character varying(200), "gender" "users_gender_enum", "birthday" date, "phone" character varying(20), "address" character varying(200), "culture" character varying(5), "currency" character varying(3), "active_key" character varying(64), "active_expire" TIMESTAMP WITH TIME ZONE, "actived_at" TIMESTAMP WITH TIME ZONE, "archived_at" TIMESTAMP WITH TIME ZONE, "forgot_key" character varying(64), "forgot_expire" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_c5efd7db748b536d6a8bfa8ffc" ON "users" ("email", "deleted_at") ');
        await queryRunner.query('CREATE TABLE "role" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "level" smallint NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_f4b4cd1c78eee453887e5baf01" ON "role" ("name", "deleted_at") ');
        await queryRunner.query('ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');

        await initData(queryRunner);
        await initBucket();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"');
        await queryRunner.query('DROP INDEX "IDX_f4b4cd1c78eee453887e5baf01"');
        await queryRunner.query('DROP TABLE "role"');
        await queryRunner.query('DROP INDEX "IDX_c5efd7db748b536d6a8bfa8ffc"');
        await queryRunner.query('DROP TABLE "users"');
        await queryRunner.query('DROP TYPE "users_gender_enum"');
        await queryRunner.query('DROP TYPE "users_status_enum"');
    }
}

/**
 * Initialize data for Role, User.
 * @param queryRunner QueryRunner
 */
async function initData(queryRunner: QueryRunner): Promise<void> {
    const roleRepository: IRoleRepository = new RoleRepository();
    const userRepository: IUserRepository = new UserRepository();

    // Initial role default: Super Admin, Common User

    let role = new Role({ id: RoleId.SUPER_ADMIN } as IRole);
    role.name = 'Super Admin';
    role.level = 1;
    await roleRepository.create(role, queryRunner);

    role = new Role({ id: RoleId.MANAGER } as IRole);
    role.name = 'Manager';
    role.level = 2;
    await roleRepository.create(role, queryRunner);

    role = new Role({ id: RoleId.CLIENT } as IRole);
    role.name = 'Client';
    role.level = 3;
    await roleRepository.create(role, queryRunner);

    // Initial user detail: Super Admin

    const user = new User();
    user.roleId = RoleId.SUPER_ADMIN;
    user.status = UserStatus.ACTIVED;
    user.firstName = 'Super';
    user.lastName = 'Admin';
    user.email = 'admin@localhost.com';
    user.password = 'Nodecore@2';
    user.gender = GenderType.MALE;
    await userRepository.create(user, queryRunner);
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
}
