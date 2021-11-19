import { ErrorCode } from './ErrorCode';
import { ErrorObject } from './ErrorObject';

export class MessageError {
    static SOMETHING_WRONG = new ErrorObject(ErrorCode.SOMETHING_WRONG, 'something_went_wrong');

    static UNKNOWN = new ErrorObject(ErrorCode.UNKNOWN, 'unknown');

    static INPUT_VALIDATION = new ErrorObject(ErrorCode.VALIDATION, 'invalid_data_check_fields_property_for_more_info');

    static PARAM_NOT_SUPPORTED = new ErrorObject(ErrorCode.NOT_SUPPORTED, '%s_is_not_supported');

    static UNAUTHORIZED = new ErrorObject(ErrorCode.UNAUTHORIZED, 'unauthorized');
    static ACCESS_DENIED = new ErrorObject(ErrorCode.ACCESS_DENIED, 'access_is_denied');

    static DATA_NOT_FOUND = new ErrorObject(ErrorCode.DATA_NOT_FOUND, 'data_not_found');
    static PARAM_NOT_FOUND = new ErrorObject(ErrorCode.DATA_NOT_FOUND, '%s_not_found');

    static DATA_CANNOT_SAVE = new ErrorObject(ErrorCode.DATA_CANNOT_SAVE, 'data_cannot_save');

    static PARAM_CANNOT_UPLOAD = new ErrorObject(ErrorCode.DATA_CANNOT_UPLOAD, '%s_cannot_upload');

    static PARAM_REQUIRED = new ErrorObject(ErrorCode.DATA_REQUIRED, '%s_is_required');

    static PARAM_INCORRECT = new ErrorObject(ErrorCode.DATA_INCORRECT, '%s_is_incorrect');

    static PARAM_EXISTED = new ErrorObject(ErrorCode.DATA_EXISTED, '%s_is_already_existed');

    static PARAM_SENT = new ErrorObject(ErrorCode.DATA_SENT, '%s_has_been_sent');

    static PARAM_NOT_EXISTS = new ErrorObject(ErrorCode.DATA_NOT_EXISTS, '%s_is_not_exists');

    static PARAM_EXPIRED = new ErrorObject(ErrorCode.DATA_EXPIRED, '%s_has_expired');

    static PARAM_NOT_ACTIVATED = new ErrorObject(ErrorCode.DATA_NOT_ACTIVATED, '%s_has_not_been_activated');

    static PARAM_NOT_VERIFIED = new ErrorObject(ErrorCode.DATA_NOT_VERIFIED, '%s_has_not_been_verified');

    // Data invalid
    static DATA_INVALID = new ErrorObject(ErrorCode.DATA_INVALID, 'data_is_invalid');
    static PARAM_INVALID = new ErrorObject(ErrorCode.DATA_INVALID, '%s_is_invalid');
    static PARAM_FORMAT_INVALID = new ErrorObject(ErrorCode.DATA_INVALID, 'format_of_%s_is_invalid_or_not_supported_following_formats_are_supported_%s');
    static PARAM_MAX_NUMBER = new ErrorObject(ErrorCode.DATA_INVALID, 'maximum_number_of_%s_is_%s');
    static PARAM_MIN_MAX_NUMBER = new ErrorObject(ErrorCode.DATA_INVALID, '%s_number_field_must_be_at_least_%s_and_a_maximum_of_%s');
    static PARAM_SIZE_MAX = new ErrorObject(ErrorCode.DATA_INVALID, 'size_of_%s_must_be_a_maximum_of_%s_%s');
    static PARAM_LEN_EQUAL = new ErrorObject(ErrorCode.DATA_INVALID, 'length_of_%s_must_be_%s');
    static PARAM_LEN_AT_LEAST = new ErrorObject(ErrorCode.DATA_INVALID, 'length_of_%s_must_be_at_least_%s');
    static PARAM_LEN_AT_LEAST_AND_MAX = new ErrorObject(ErrorCode.DATA_INVALID, 'length_of_%s_must_be_at_least_%s_and_maximum_%s');
    static PARAM_LEN_AT_LEAST_AND_MAX_SPECIAL = new ErrorObject(ErrorCode.DATA_INVALID, 'length_of_%s_must_be_at_least_%s_and_maximum_%s_with_one_uppercase_letter_one_lower_case_letter_one_digit_and_one_special_character');
    static PARAM_LEN_MAX = new ErrorObject(ErrorCode.DATA_INVALID, 'length_of_%s_must_be_a_maximum_of_%s');
    static PARAM_LEN_LESS_OR_EQUAL = new ErrorObject(ErrorCode.DATA_INVALID, 'length_of_%s_must_be_less_than_or_equal_to_%s');
    static PARAM_LEN_GREATER_OR_EQUAL = new ErrorObject(ErrorCode.DATA_INVALID, 'length_of_%s_must_be_greater_than_or_equal_to_%s');
    static PARAM_LEN_BETWEEN = new ErrorObject(ErrorCode.DATA_INVALID, 'length_of_%s_must_be_between_%s_and_%s');
}
