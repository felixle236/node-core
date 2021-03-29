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
    d = this.addDays(d, 1);

    return this.addSeconds(d, -1);
}

/**
 * Add miliseconds
 */
export function addMiliseconds(date: Date, miliseconds: number): Date {
    date.setMilliseconds(date.getMilliseconds() + miliseconds);
    return date;
}

/**
 * Add seconds
 */
export function addSeconds(date: Date, seconds: number): Date {
    date.setSeconds(date.getSeconds() + seconds);
    return date;
}

/**
 * Add minutes
 */
export function addMinutes(date: Date, minutes: number): Date {
    date.setMinutes(date.getMinutes() + minutes);
    return date;
}

/**
 * Add hours
 */
export function addHours(date: Date, hours: number): Date {
    date.setHours(date.getHours() + hours);
    return date;
}

/**
 * Add days
 */
export function addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
}

/**
 * Add months
 */
export function addMonths(date: Date, months: number): Date {
    date.setMonth(date.getMonth() + months);
    return date;
}

/**
 * Add years
 */
export function addYears(date: Date, years: number): Date {
    date.setFullYear(date.getFullYear() + years);
    return date;
}
