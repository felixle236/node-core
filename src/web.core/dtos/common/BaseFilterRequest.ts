import { ResultListResponse } from './ResultListResponse';

export class BaseFilterRequest {
    private limitDefault = 10;
    private maxLimitDefault = 30;

    private _skip: number = 0;
    private _limit: number = this.limitDefault;
    private _maxLimit: number = this.maxLimitDefault;

    get skip(): number {
        return this._skip;
    }

    set skip(val: number) {
        if (typeof val !== 'number') {
            if (!isNaN(val))
                val = Number(val);
            else
                val = 0;
        }

        if (val < 0)
            val = 0;

        this._skip = val;
    }

    get limit(): number {
        if (this._limit > this._maxLimit)
            return this._maxLimit;
        return this._limit;
    }

    set limit(val: number) {
        if (typeof val !== 'number') {
            if (!isNaN(val))
                val = Number(val);
            else
                val = this.limitDefault;
        }

        if (val < 1)
            val = this.limitDefault;

        this._limit = val;
    }

    maxLimit(val: number) {
        if (typeof val !== 'number') {
            if (!isNaN(val))
                val = Number(val);
            else
                val = this.maxLimitDefault;
        }

        if (val < 1)
            val = this.maxLimitDefault;

        this._maxLimit = val;
    }

    toResultList<T>(list: T[], total: number): ResultListResponse<T> {
        return new ResultListResponse(list, total, this.skip, this.limit);
    }
}
