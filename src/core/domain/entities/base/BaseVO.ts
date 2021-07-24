import { IValueObject } from '@domain/interfaces/base/IValueObject';

export abstract class BaseVO implements IValueObject {
    constructor(protected readonly data = {} as IValueObject) { }

    /* Handlers */

    toData(): IValueObject {
        return this.data;
    }
}
