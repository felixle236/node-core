/**
 * Format date to string
 */
export function formatDateString(date: string | Date): string {
    if (!date) return '';

    const d = typeof date === 'string' ? new Date(date) : date;
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

/**
 * Add miliseconds
 */
export function addMiliseconds(date: Date, miliseconds: number): Date {
    const d = new Date(date);
    d.setMilliseconds(d.getMilliseconds() + miliseconds);
    return d;
}

/**
 * Add seconds
 */
export function addSeconds(date: Date, seconds: number): Date {
    const d = new Date(date);
    d.setSeconds(d.getSeconds() + seconds);
    return d;
}

/**
 * Add minutes
 */
export function addMinutes(date: Date, minutes: number): Date {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() + minutes);
    return d;
}

/**
 * Add hours
 */
export function addHours(date: Date, hours: number): Date {
    const d = new Date(date);
    d.setHours(d.getHours() + hours);
    return d;
}

/**
 * Add days
 */
export function addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}

/**
 * Add months
 */
export function addMonths(date: Date, months: number): Date {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
}

/**
 * Add years
 */
export function addYears(date: Date, years: number): Date {
    const d = new Date(date);
    d.setFullYear(d.getFullYear() + years);
    return d;
}

/**
 * Get begin of day
 */
export function getBeginOfDay(date: string | Date): Date {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * Get end of day
 */
export function getEndOfDay(date: string | Date): Date {
    let d = typeof date === 'string' ? new Date(date) : date;
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    d = addDays(d, 1);

    return addMiliseconds(d, -1);
}

/**
 * Get begin of month
 */
export function getBeginOfMonth(date: string | Date): Date {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Date(d.getFullYear(), d.getMonth(), 1);
}

/**
 * Get begin of month
 */
export function getEndOfMonth(date: string | Date): Date {
    let d = typeof date === 'string' ? new Date(date) : date;
    d = new Date(d.getFullYear(), d.getMonth(), 1);
    d = addMonths(d, 1);
    return addDays(d, -1);
}
