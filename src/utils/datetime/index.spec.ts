import 'mocha';
import { expect } from 'chai';
import { addDays, addHours, addMiliseconds, addMinutes, addMonths, addSeconds, addYears, formatDateString, getBeginOfDay, getBeginOfMonth, getEndOfDay, getEndOfMonth } from '.';

describe('Utils - Date time', () => {
    it('Format date string with empty value', () => {
        const data = formatDateString('');

        expect(data).to.eq('');
    });

    it('Format date string to date string', () => {
        const data = formatDateString('1970-01-01');

        expect(data).to.eq('1970-01-01');
    });

    it('Format date to date string', () => {
        const data = formatDateString(new Date(1970, 0, 1));

        expect(data).to.eq('1970-01-01');
    });

    it('Add miliseconds to date', () => {
        const date = new Date();
        const data = addMiliseconds(date, 10);

        expect(date.getTime() + 10).to.eq(data.getTime());
    });

    it('Add seconds to date', () => {
        const date = new Date();
        const data = addSeconds(date, 10);

        expect(date.getTime() + 10 * 1000).to.eq(data.getTime());
    });

    it('Add minutes to date', () => {
        const date = new Date();
        const data = addMinutes(date, 10);

        expect(date.getTime() + 10 * 60 * 1000).to.eq(data.getTime());
    });

    it('Add hours to date', () => {
        const date = new Date();
        const data = addHours(date, 10);

        expect(date.getTime() + 10 * 60 * 60 * 1000).to.eq(data.getTime());
    });

    it('Add days to date', () => {
        const date = new Date();
        const data = addDays(date, 10);

        expect(date.getTime() + 10 * 24 * 60 * 60 * 1000).to.eq(data.getTime());
    });

    it('Add months to date', () => {
        const date = new Date('1970-01-01');
        const data = addMonths(date, 1);

        expect(data.getTime()).to.eq(new Date('1970-02-01').getTime());
    });

    it('Add years to date', () => {
        const date = new Date('1970-01-01');
        const data = addYears(date, 1);

        expect(data.getTime()).to.eq(new Date('1971-01-01').getTime());
    });

    it('Get begin of day date', () => {
        const date = new Date('1970-01-01 12:12:12');
        const data = getBeginOfDay(date);

        expect(data.getTime()).to.eq(new Date(1970, 0, 1).getTime());
    });

    it('Get begin of day date by string', () => {
        const data = getBeginOfDay('1970-01-01 12:12:12');

        expect(data.getTime()).to.eq(new Date(1970, 0, 1).getTime());
    });

    it('Get end of day date', () => {
        const date = new Date('1970-01-01 12:12:12');
        const data = getEndOfDay(date);

        expect(data.getTime()).to.eq(new Date(1970, 0, 1, 23, 59, 59, 999).getTime());
    });

    it('Get end of day date by string', () => {
        const data = getEndOfDay('1970-01-01 12:12:12');

        expect(data.getTime()).to.eq(new Date(1970, 0, 1, 23, 59, 59, 999).getTime());
    });

    it('Get begin of month date', () => {
        const date = new Date('1970-01-01 12:12:12');
        const data = getBeginOfMonth(date);

        expect(data.getTime()).to.eq(new Date(1970, 0, 1).getTime());
    });

    it('Get begin of month date by string', () => {
        const data = getBeginOfMonth('1970-01-01 12:12:12');

        expect(data.getTime()).to.eq(new Date(1970, 0, 1).getTime());
    });

    it('Get end of month date', () => {
        const date = new Date('1970-01-01 12:12:12');
        const data = getEndOfMonth(date);

        expect(data.getTime()).to.eq(new Date(1970, 0, 31).getTime());
    });

    it('Get end of month date by string', () => {
        const data = getEndOfMonth('1970-01-01 12:12:12');

        expect(data.getTime()).to.eq(new Date(1970, 0, 31).getTime());
    });
});
