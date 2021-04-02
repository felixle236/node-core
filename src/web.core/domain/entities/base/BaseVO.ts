export abstract class BaseVO<TVO> {
    constructor(protected readonly data = {} as TVO) { }

    /* Handlers */

    toData(): TVO {
        return this.data;
    }
}
