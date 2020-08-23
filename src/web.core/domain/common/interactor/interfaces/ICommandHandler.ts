import { ICommand } from './ICommand';

export interface ICommandHandler<TIn extends ICommand, TOut> {
    handle(param: TIn): Promise<TOut>;
}
