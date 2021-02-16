import { ErrorCode } from './ErrorCode';
import { ErrorObject } from './ErrorObject';

export class MessageError {
    static SOMETHING_WRONG = new ErrorObject(ErrorCode.SOMETHING_WRONG, 'Something went wrong!');

    static OTHER = new ErrorObject(ErrorCode.OTHER, '{0}');

    static PARAM_NOT_SUPPORTED = new ErrorObject(ErrorCode.NOT_SUPPORTED, 'The {0} is not supported!');

    static ACCESS_DENIED = new ErrorObject(ErrorCode.ACCESS_DENIED, 'Access is denied!');

    static DATA_NOT_FOUND = new ErrorObject(ErrorCode.DATA_NOT_FOUND, 'Data not found!');
    static PARAM_NOT_FOUND = new ErrorObject(ErrorCode.DATA_NOT_FOUND, 'The {0} was not found!');

    static DATA_CANNOT_SAVE = new ErrorObject(ErrorCode.DATA_CANNOT_SAVE, 'Data cannot save!');

    static PARAM_CANNOT_UPLOAD = new ErrorObject(ErrorCode.DATA_CANNOT_UPLOAD, 'The {0} cannot upload!');

    static PARAM_REQUIRED = new ErrorObject(ErrorCode.DATA_REQUIRED, 'The {0} is required!');

    static PARAM_INCORRECT = new ErrorObject(ErrorCode.DATA_INCORRECT, 'The {0} is incorrect!');

    static PARAM_EXISTED = new ErrorObject(ErrorCode.DATA_EXISTED, 'The {0} is already existed!');

    static PARAM_SENT = new ErrorObject(ErrorCode.DATA_SENT, 'The {0} has been sent!');

    static PARAM_NOT_EXISTS = new ErrorObject(ErrorCode.DATA_NOT_EXISTS, 'The {0} is not exists!');

    static PARAM_EXPIRED = new ErrorObject(ErrorCode.DATA_EXPIRED, 'The {0} has expired!');

    static PARAM_NOT_ACTIVATED = new ErrorObject(ErrorCode.DATA_NOT_ACTIVATED, 'The {0} has not been activated!');

    static PARAM_NOT_VERIFIED = new ErrorObject(ErrorCode.DATA_NOT_VERIFIED, 'The {0} has not been verified!');

    static DATA_INVALID = new ErrorObject(ErrorCode.DATA_INVALID, 'Data is invalid!');
    static PARAM_INVALID = new ErrorObject(ErrorCode.DATA_INVALID, 'The {0} is invalid!');
    static PARAM_FORMAT_INVALID = new ErrorObject(ErrorCode.DATA_INVALID, 'The format of {0} is invalid or not supported! The following formats are supported: {1}');
    static PARAM_MAX_NUMBER = new ErrorObject(ErrorCode.DATA_INVALID, 'The maximum number of {0} is {1}!');
    static PARAM_MIN_MAX_NUMBER = new ErrorObject(ErrorCode.DATA_INVALID, 'The {0} number field must be at least {1} and a maximum of {2}!');
    static PARAM_SIZE_MAX = new ErrorObject(ErrorCode.DATA_INVALID, 'The size of {0} must be a maximum of {1} ({2})!');
    static PARAM_LEN_EQUAL = new ErrorObject(ErrorCode.DATA_INVALID, 'The length of {0} must be {1}!');
    static PARAM_LEN_AT_LEAST = new ErrorObject(ErrorCode.DATA_INVALID, 'The length of {0} must be at least {1}!');
    static PARAM_LEN_AT_LEAST_AND_MAX = new ErrorObject(ErrorCode.DATA_INVALID, 'The length of {0} must be at least {1} and maximum {2}!');
    static PARAM_LEN_AT_LEAST_AND_MAX_SPECIAL = new ErrorObject(ErrorCode.DATA_INVALID, 'The length of {0} must be at least {1} and maximum {2} with one uppercase letter, one lower case letter, one digit and one special character!');
    static PARAM_LEN_MAX = new ErrorObject(ErrorCode.DATA_INVALID, 'The length of {0} must be a maximum of {1}!');
    static PARAM_LEN_LESS_OR_EQUAL = new ErrorObject(ErrorCode.DATA_INVALID, 'The length of {0} must be less than or equal to {1}!');
    static PARAM_LEN_GREATER_OR_EQUAL = new ErrorObject(ErrorCode.DATA_INVALID, 'The length of {0} must be greater than or equal to {1}!');
    static PARAM_LEN_BETWEEN = new ErrorObject(ErrorCode.DATA_INVALID, 'The length of {0} must be between {1} and {2}!');
}
