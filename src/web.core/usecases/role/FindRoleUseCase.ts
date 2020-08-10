import { Inject, Service } from 'typedi';
import { IRoleFilter } from '../../interfaces/models/role/IRoleFilter';
import { IRoleRepository } from '../../interfaces/repositories/IRoleRepository';
import { IUseCase } from '../../d../../domain/common/IUseCase';
import { Role } from '../../domain/entities/Role';
import { UserAuthenticated } from '../../domain/common/UserAuthenticated';

@Service()
export class FindRoleUseCase implements IUseCase {
    filter: IRoleFilter;
    userAuth: UserAuthenticated;

    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async execute(): Promise<[Role[], number]> {
        this.filter.userAuth = this.userAuth;
        return await this._roleRepository.find(this.filter);
    }
}
