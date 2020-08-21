import { Inject, Service } from 'typedi';
import { FindRoleInput } from './Input';
import { FindRoleOutput } from './Output';
import { IQueryHandler } from '../../../../domain/common/interactor/IQueryHandler';
import { IRoleRepository } from '../../../../gateways/repositories/IRoleRepository';
import { PaginationResult } from '../../../../domain/common/results/PaginationResult';

@Service()
export class FindRoleInteractor implements IQueryHandler<FindRoleInput, PaginationResult<FindRoleOutput>> {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async handle(input: FindRoleInput): Promise<PaginationResult<FindRoleOutput>> {
        const [roles, count] = await this._roleRepository.findAndCount(input);
        const list = roles.map(role => new FindRoleOutput(role));

        return new PaginationResult(list, count, input.skip, input.limit);
    }
}
