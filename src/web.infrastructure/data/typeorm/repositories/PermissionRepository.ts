import * as path from 'path';
import { Container, Inject, Service } from 'typedi';
import { QueryRunner, getRepository } from 'typeorm';
import { mapModel, mapModels } from '../../../../libs/common';
import { ClaimItem } from '../../../../web.core/dtos/permission/responses/ClaimItem';
import { ClaimResponse } from '../../../../web.core/dtos/permission/responses/ClaimResponse';
import { DbContext } from '../DbContext';
import { IPermission } from '../../../../web.core/interfaces/models/IPermission';
import { IPermissionRepository } from '../../../../web.core/interfaces/gateways/data/IPermissionRepository';
import { Permission } from '../../../../web.core/models/Permission';
import { PermissionEntity } from '../entities/PermissionEntity';
import { PermissionSchema } from '../schemas/PermissionSchema';
import { RoleSchema } from '../schemas/RoleSchema';
import { getFiles } from '../../../../libs/file';

@Service('permission.repository')
export class PermissionRepository implements IPermissionRepository {
    @Inject('database.context')
    private readonly dbContext: DbContext;

    private readonly repository = getRepository<IPermission>(PermissionEntity);

    async getClaims(): Promise<ClaimResponse[]> {
        const claims = Container.has<ClaimResponse[]>('claims') ? Container.get<ClaimResponse[]>('claims') : [];
        if (claims.length)
            return claims;

        const dir = path.join(__dirname, '../../../../constants/claims/');
        const files = await getFiles(dir);

        files.forEach(file => {
            const claim = require(dir + file);
            Object.keys(claim).forEach(claimName => {
                const name = claimName.substr(0, claimName.toLowerCase().lastIndexOf('claim'));
                const claimView = new ClaimResponse(name);
                claims.push(claimView);

                Object.keys(claim[claimName]).forEach(name => {
                    const item = new ClaimItem();
                    item.code = claim[claimName][name];
                    item.name = name;
                    claimView.items.push(item);
                });
            });
        });

        Container.set('claims', claims);
        return claims;
    }

    async getAllByRole(roleId: number, expireTimeCaching: number = 24 * 60 * 60 * 1000): Promise<Permission[]> {
        const permissions = await this.repository.createQueryBuilder(PermissionSchema.TABLE_NAME)
            .innerJoin(`${PermissionSchema.TABLE_NAME}.${PermissionSchema.RELATED_ONE.ROLE}`, RoleSchema.TABLE_NAME)
            .cache('permissions', expireTimeCaching)
            .getMany();
        return mapModels(Permission, permissions.filter(permission => permission.roleId === roleId));
    }

    async getById(id: number): Promise<Permission | undefined> {
        const permission = await this.repository.createQueryBuilder(PermissionSchema.TABLE_NAME)
            .innerJoinAndSelect(`${PermissionSchema.TABLE_NAME}.${PermissionSchema.RELATED_ONE.ROLE}`, RoleSchema.TABLE_NAME)
            .whereInIds(id)
            .getOne();

        return mapModel(Permission, permission);
    }

    async create(permission: Permission, queryRunner?: QueryRunner): Promise<number | undefined> {
        const result = await this.repository.createQueryBuilder(PermissionSchema.TABLE_NAME, queryRunner)
            .insert()
            .values(permission.toData())
            .execute();
        return result.identifiers && result.identifiers.length && result.identifiers[0].id;
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(PermissionSchema.TABLE_NAME)
            .delete()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async clearCaching(): Promise<void> {
        await this.dbContext.clearCaching('permissions');
    }
}
