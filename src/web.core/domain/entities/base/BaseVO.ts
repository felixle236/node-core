export abstract class BaseVO<TVO> {
    constructor(protected readonly data = {} as TVO) { }

    toData(): TVO {
        return this.data;
    }
}
