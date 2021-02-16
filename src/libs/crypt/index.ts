import * as crypto from 'crypto';

/**
 * Hash data with md5
 */
export function hashMD5(content: string, salt: string | null = null): string {
    return content ? crypto.createHash('md5').update((salt ?? '') + content).digest('hex') : '';
}
