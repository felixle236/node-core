import { IValueObject } from '@domain/interfaces/base/IValueObject';

export abstract class BaseVO<TIVO extends IValueObject> implements IValueObject {
    constructor(protected readonly data = {} as TIVO) { }

    /* Handlers */

    toData(): TIVO {
        return this.data;
    }
}
