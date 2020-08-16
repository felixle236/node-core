import { IFilter } from './IFilter';

export abstract class BaseFilter implements IFilter {
    private readonly _limitDefault = 10;
    private readonly _maxLimitDefault = 30;

    private _skip: number = 0;
    private _limit: number = this._limitDefault;
    private _maxLimit: number = this._maxLimitDefault;

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
                val = this._limitDefault;
        }

        if (val < 1)
            val = this._limitDefault;

        this._limit = val;
    }

    maxLimit(val: number) {
        if (typeof val !== 'number') {
            if (!isNaN(val))
                val = Number(val);
            else
                val = this._maxLimitDefault;
        }

        if (val < 1)
            val = this._maxLimitDefault;

        this._maxLimit = val;
    }
}
