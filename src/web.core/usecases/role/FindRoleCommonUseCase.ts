import { Inject, Service } from 'typedi';
import { IRoleCommonFilter } from '../../interfaces/models/role/IRoleCommonFilter';
import { IRoleRepository } from '../../interfaces/repositories/IRoleRepository';
import { IUseCase } from '../../domain/common/IUseCase';
import { Role } from '../../domain/entities/Role';
import { UserAuthenticated } from '../../domain/common/UserAuthenticated';

@Service()
export class FindRoleCommonUseCase implements IUseCase {
    filter: IRoleCommonFilter;
    userAuth: UserAuthenticated;

    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async execute(): Promise<[Role[], number]> {
        this.filter.userAuth = this.userAuth;
        return await this._roleRepository.findCommon(this.filter);
    }
}
