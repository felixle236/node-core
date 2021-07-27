import { IDbQueryRunner } from '@shared/database/interfaces/IDbQueryRunner';

export abstract class CommandHandler<TIn, TOut> {
    abstract handle(param: number | string | TIn, param2: TIn | IDbQueryRunner): Promise<TOut>;
    abstract handle(param: number | string | TIn, param2: TIn | IDbQueryRunner, param3: IDbQueryRunner): Promise<TOut>;
}
