export class MessageError {
    static ERR_0001 = 'Data is invalid!';
    static ERR_0002 = 'Something went wrong!';
    static ERR_0003 = 'Access is denied!';
    static ERR_0004 = 'Data not found!';
    static ERR_0005 = 'Data cannot save!';
    static ERR_0006 = 'File too large!';
    static ERR_0007 = 'File name too long!';

    static ERR_1001 = 'The {0} is required!';
    static ERR_1002 = 'The {0} is invalid!';
    static ERR_1003 = 'The {0} is incorrect!';
    static ERR_1004 = 'The {0} is not exists!';
    static ERR_1005 = 'The {0} is already existed!';
    static ERR_1006 = 'The {0} is enabled!';
    static ERR_1007 = 'The {0} is disabled!';
    static ERR_1008 = 'The {0} has expired!';
    static ERR_1009 = 'The {0} has not been verified!';
    static ERR_1010 = 'The {0} was not found!';

    static ERR_2001 = 'The {0} must be {1} characters!';
    static ERR_2002 = 'The {0} must be at least {1} characters!';
    static ERR_2003 = 'The {0} must be a maximum of {1} characters!';
    static ERR_2004 = 'The {0} must be less than or equal to {1}!';
    static ERR_2005 = 'The {0} must be greater than or equal to {1}!';
    static ERR_2006 = 'Invalid or unsupported {0} format! The following formats are supported: {1}';

    static ERR_3001 = 'The {0} must be at least {1} and maximum {2} characters!';
    static ERR_3002 = 'The {0} must be at least {1} and maximum {2} characters with one uppercase letter, one lower case letter, one digit and one special character!';
    static ERR_3003 = 'The {0} must be at least {1} characters {2}!';
    static ERR_3004 = 'The {0} must be between {1} and {2}!';
    static ERR_3005 = 'The {0} must be a maximum of {1} {2}!';
}

/**
 * Get message error by code
 */
export function getMessageError(code: number) {
    const key = 'ERR_' + code.toString().padStart(4, '0');
    return MessageError[key];
}
