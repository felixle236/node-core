import { Gender, RoleId } from '../../../../constants/Enums';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { BUCKET_NAME } from '../../../../constants/Environments';
import { IPermissionRepository } from '../../../../web.core/interfaces/gateways/data/IPermissionRepository';
import { IRole } from '../../../../web.core/interfaces/models/IRole';
import { IRoleRepository } from '../../../../web.core/interfaces/gateways/data/IRoleRepository';
import { IStorageService } from '../../../../web.core/interfaces/gateways/medias/IStorageService';
import { IUserRepository } from '../../../../web.core/interfaces/gateways/data/IUserRepository';
import { Permission } from '../../../../web.core/models/Permission';
import { PermissionClaim } from '../../../../constants/claims/PermissionClaim';
import { PermissionRepository } from '../repositories/PermissionRepository';
import { Role } from '../../../../web.core/models/Role';
import { RoleClaim } from '../../../../constants/claims/RoleClaim';
import { RoleRepository } from '../repositories/RoleRepository';
import { StorageService } from '../../../medias/storage/StorageService';
import { SystemClaim } from '../../../../constants/claims/SystemClaim';
import { User } from '../../../../web.core/models/User';
import { UserClaim } from '../../../../constants/claims/UserClaim';
import { UserRepository } from '../repositories/UserRepository';

export class Initialize1581270591670 implements MigrationInterface {
    name = 'Initialize1581270591670'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('CREATE TABLE "permission" ("id" SERIAL NOT NULL, "role_id" integer NOT NULL, "claim" integer NOT NULL, CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_2f40e26a987fc2b8edacd2a15c" ON "permission" ("role_id", "claim") ');
        await queryRunner.query('CREATE TABLE "role" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" character varying(50) NOT NULL, "level" smallint NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_f4b4cd1c78eee453887e5baf01" ON "role" ("name", "deleted_at") ');
        await queryRunner.query('CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "role_id" integer NOT NULL, "first_name" character varying(20) NOT NULL, "last_name" character varying(20), "email" character varying(120) NOT NULL, "password" character varying(32) NOT NULL, "avatar" character varying(200), "gender" smallint, "birthday" date, "phone" character varying(20), "address" character varying(200), "culture" character varying(5), "currency" character varying(3), "active_key" character varying(64), "active_expire" TIMESTAMP WITH TIME ZONE, "actived_at" TIMESTAMP WITH TIME ZONE, "forgot_key" character varying(64), "forgot_expire" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_7116230c2cf23ab77fbab495b8" ON "users" ("active_key") ');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_55b530a739894009fd921a3ba0" ON "users" ("forgot_key") ');
        await queryRunner.query('CREATE UNIQUE INDEX "IDX_c5efd7db748b536d6a8bfa8ffc" ON "users" ("email", "deleted_at") ');
        await queryRunner.query('CREATE TABLE "message" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "sender_id" integer NOT NULL, "receiver_id" integer, "room" integer NOT NULL, "content" character varying(2000) NOT NULL, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE INDEX "IDX_02902857a6cf9df1ad2f26f321" ON "message" ("room") ');
        await queryRunner.query('ALTER TABLE "permission" ADD CONSTRAINT "FK_383892d758d08d346f837d3d8b7" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "message" ADD CONSTRAINT "FK_c0ab99d9dfc61172871277b52f6" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
        await queryRunner.query('ALTER TABLE "message" ADD CONSTRAINT "FK_f4da40532b0102d51beb220f16a" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');

        await initData(queryRunner);
        await initBucket();
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('ALTER TABLE "message" DROP CONSTRAINT "FK_f4da40532b0102d51beb220f16a"');
        await queryRunner.query('ALTER TABLE "message" DROP CONSTRAINT "FK_c0ab99d9dfc61172871277b52f6"');
        await queryRunner.query('ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"');
        await queryRunner.query('ALTER TABLE "permission" DROP CONSTRAINT "FK_383892d758d08d346f837d3d8b7"');
        await queryRunner.query('DROP INDEX "IDX_02902857a6cf9df1ad2f26f321"');
        await queryRunner.query('DROP TABLE "message"');
        await queryRunner.query('DROP INDEX "IDX_c5efd7db748b536d6a8bfa8ffc"');
        await queryRunner.query('DROP INDEX "IDX_55b530a739894009fd921a3ba0"');
        await queryRunner.query('DROP INDEX "IDX_7116230c2cf23ab77fbab495b8"');
        await queryRunner.query('DROP TABLE "users"');
        await queryRunner.query('DROP INDEX "IDX_f4b4cd1c78eee453887e5baf01"');
        await queryRunner.query('DROP TABLE "role"');
        await queryRunner.query('DROP INDEX "IDX_2f40e26a987fc2b8edacd2a15c"');
        await queryRunner.query('DROP TABLE "permission"');
    }
}

/**
 * Initialize data for Role, Permission, User.
 * @param queryRunner QueryRunner
 */
async function initData(queryRunner: QueryRunner): Promise<void> {
    const roleRepository: IRoleRepository = new RoleRepository();
    const userRepository: IUserRepository = new UserRepository();
    const permissionRepository: IPermissionRepository = new PermissionRepository();

    // Initial role default: Super Admin, Common User

    let role = new Role({ id: RoleId.SuperAdmin } as IRole);
    role.name = 'Super Admin';
    role.level = 1;
    await roleRepository.create(role, queryRunner);

    role = new Role({ id: RoleId.CommonUser } as IRole);
    role.name = 'Common User';
    role.level = 2;
    await roleRepository.create(role, queryRunner);

    // Initial user detail: Super Admin

    const user = new User();
    user.roleId = RoleId.SuperAdmin;
    user.firstName = 'Super';
    user.lastName = 'Admin';
    user.email = 'admin@localhost.com';
    user.password = 'Nodecore@2';
    user.gender = Gender.Male;
    user.activedAt = new Date();
    await userRepository.create(user, queryRunner);

    // Initial permission for Super Admin

    const claims = [
        SystemClaim.INIT_DATA,
        RoleClaim.GET,
        RoleClaim.CREATE,
        RoleClaim.UPDATE,
        RoleClaim.DELETE,
        PermissionClaim.GET,
        PermissionClaim.CREATE,
        PermissionClaim.DELETE,
        UserClaim.GET,
        UserClaim.CREATE,
        UserClaim.UPDATE,
        UserClaim.UPDATE_ROLE,
        UserClaim.DELETE
    ];

    for (let i = 0; i < claims.length; i++) {
        const permission = new Permission();
        permission.roleId = RoleId.SuperAdmin;
        permission.claim = claims[i];
        await permissionRepository.create(permission, queryRunner);
    }
}

/**
 * Initialize bucket.
 */
async function initBucket(): Promise<void> {
    const storageService: IStorageService = new StorageService();
    const bucketExist = await storageService.checkBucketExist(BUCKET_NAME);
    if (!bucketExist) {
        await storageService.createBucket(BUCKET_NAME);

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
        await storageService.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
    }
}
