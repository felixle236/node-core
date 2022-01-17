/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/naming-convention */
import * as classValidator from 'class-validator';
import ValidatorJS from 'validator';

export const Allow = classValidator.Allow;

export const IsOptional = classValidator.IsOptional;

export const Validate = classValidator.Validate;

export const ValidateBy = classValidator.ValidateBy;

export const ValidateIf = classValidator.ValidateIf;

export const ValidatePromise = classValidator.ValidatePromise;

/**
 * Initialize the message for validation decorator.
 */
export function intlMsg(key: string, params?: object) {
  return (args: classValidator.ValidationArguments) => JSON.stringify({ key, field: args.property, params });
}

export const ValidateNested = (opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.ValidateNested({ ...opts, message: intlMsg('validate_nested') });

export const IsArray = (opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.IsArray({ ...opts, message: intlMsg('is_array') });

export const IsBoolean = (opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.IsBoolean({ ...opts, message: intlMsg('is_boolean') });

export const IsDate = (opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.IsDate({ ...opts, message: intlMsg('is_date') });

export const IsDateString = (iOpts?: ValidatorJS.IsISO8601Options, opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.IsDateString(iOpts, { ...opts, message: intlMsg('is_date_string') });

/**
 * Validate date only
 */
function isDateOnlyString(validationOptions?: classValidator.ValidationOptions): PropertyDecorator {
  return function (object: Object, propertyName: string | any) {
    classValidator.registerDecorator({
      name: 'isDateOnlyString',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value === 'string') {
            return /^[1-9]\d*-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(value) && classValidator.isDate(new Date(value));
          }
          return false;
        },
      },
    });
  };
}

export const IsDateOnlyString = (opts?: classValidator.ValidationOptions): PropertyDecorator =>
  isDateOnlyString({ ...opts, message: intlMsg('is_date_only_string') });

/**
 * Checks if the value is a date in the past.
 */
function isPastDate(validationOptions?: classValidator.ValidationOptions) {
  return function (object: Object, propertyName: string | any) {
    classValidator.registerDecorator({
      name: 'isPastDate',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: classValidator.ValidationArguments) {
          if (classValidator.isDateString(value)) {
            value = new Date(value);
            args.object[propertyName] = value;
          }
          return value instanceof Date && !isNaN(value.getDate()) && value.getTime() < Date.now();
        },
      },
    });
  };
}

export const IsPastDate = (opts?: classValidator.ValidationOptions): PropertyDecorator =>
  isPastDate({ ...opts, message: intlMsg('is_past_date') });

/**
 * Checks if the value is a date in the future.
 */
function isFutureDate(validationOptions?: classValidator.ValidationOptions) {
  return function (object: Object, propertyName: string | any) {
    classValidator.registerDecorator({
      name: 'isFutureDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: classValidator.ValidationArguments) {
          if (classValidator.isDateString(value)) {
            value = new Date(value);
            args.object[propertyName] = value;
          }
          return value instanceof Date && !isNaN(value.getDate()) && value.getTime() > Date.now();
        },
      },
    });
  };
}

export const IsFutureDate = (opts?: classValidator.ValidationOptions): PropertyDecorator =>
  isFutureDate({ ...opts, message: intlMsg('is_future_date') });

export const IsEnum = (entity: object, opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.IsEnum(entity, { ...opts, message: intlMsg('is_enum') });

export const IsInt = (opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.IsInt({ ...opts, message: intlMsg('is_int') });

export const IsNumber = (nOpts?: classValidator.IsNumberOptions, opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.IsNumber(nOpts, { ...opts, message: intlMsg('is_number') });

export const IsNumberString = (nOpts?: ValidatorJS.IsNumericOptions, opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.IsNumberString(nOpts, { ...opts, message: intlMsg('is_number_string') });

export const IsNegative = (opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.IsNegative({ ...opts, message: intlMsg('is_negative') });

export const IsPositive = (opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.IsPositive({ ...opts, message: intlMsg('is_positive') });

export const IsDecimal = (dOpts?: ValidatorJS.IsDecimalOptions, opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.IsDecimal(dOpts, { ...opts, message: intlMsg('is_decimal') });

export const IsNotEmpty = (opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.IsNotEmpty({ ...opts, message: intlMsg('is_not_empty') });

export const IsString = (opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.IsString({ ...opts, message: intlMsg('is_string') });

export const IsObject = (opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.IsObject({ ...opts, message: intlMsg('is_object') });

export const IsNotEmptyObject = (neOpts?: { nullable?: boolean }, opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.IsNotEmptyObject(neOpts, { ...opts, message: intlMsg('is_not_empty_object') });

export const IsIn = (values: readonly any[], opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.IsIn(values, { ...opts, message: intlMsg('is_in', { values }) });

export const IsLatitude = (opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.IsLatitude({ ...opts, message: intlMsg('is_latitude') });

export const IsLongitude = (opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.IsLongitude({ ...opts, message: intlMsg('is_longitude') });

export const IsLatLong = (opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.IsLatLong({ ...opts, message: intlMsg('is_lat_long') });

export const IsUUID = (version?: classValidator.UUIDVersion, opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.IsUUID(version, { ...opts, message: intlMsg('is_uuid') });

export const IsUrl = (uOpts?: ValidatorJS.IsURLOptions, opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.IsUrl(uOpts, { ...opts, message: intlMsg('is_url') });

export const IsBase64 = (opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.IsBase64({ ...opts, message: intlMsg('is_base64') });

export const IsCreditCard = (opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.IsCreditCard({ ...opts, message: intlMsg('is_credit_card') });

export const IsCurrency = (cOpts?: ValidatorJS.IsCurrencyOptions, opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.IsCurrency(cOpts, { ...opts, message: intlMsg('is_currency') });

export const IsEmail = (eOpts?: ValidatorJS.IsEmailOptions, opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.IsEmail(eOpts, { ...opts, message: intlMsg('is_email') });

export const IsHexColor = (opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.IsHexColor({ ...opts, message: intlMsg('is_hex_color') });

export const IsJWT = (opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.IsJWT({ ...opts, message: intlMsg('is_jwt') });

export const IsLocale = (opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.IsLocale({ ...opts, message: intlMsg('is_locale') });

export const IsMobilePhone = (
  locale?: ValidatorJS.MobilePhoneLocale,
  mOpts?: ValidatorJS.IsMobilePhoneOptions,
  opts?: classValidator.ValidationOptions,
): PropertyDecorator => classValidator.IsMobilePhone(locale, mOpts, { ...opts, message: intlMsg('is_mobile_phone', { locale }) });

export const IsMongoId = (opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.IsMongoId({ ...opts, message: intlMsg('is_mongo_id') });

export const IsPassportNumber = (countryCode: string, opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.IsPassportNumber(countryCode, { ...opts, message: intlMsg('is_passport_number', { countryCode }) });

export const IsPhoneNumber = (region?: string | any, opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.IsPhoneNumber(region, { ...opts, message: intlMsg('is_phone_number', { region }) });

export const IsPostalCode = (locale?: 'any' | ValidatorJS.PostalCodeLocale, opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.IsPostalCode(locale, { ...opts, message: intlMsg('is_postal_code', { locale }) });

export const ArrayNotEmpty = (opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.ArrayNotEmpty({ ...opts, message: intlMsg('array_not_empty') });

export const ArrayMinSize = (min: number, opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.ArrayMinSize(min, { ...opts, message: intlMsg('array_min_size', { min }) });

export const ArrayMaxSize = (max: number, opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.ArrayMaxSize(max, { ...opts, message: intlMsg('array_max_size', { max }) });

export const Length = (min: number, max: number, opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.Length(min, max, { ...opts, message: intlMsg('length', { min, max }) });

export const Contains = (seed: string, opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.Contains(seed, { ...opts, message: intlMsg('contains', { seed }) });

export const NotContains = (seed: string, opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.NotContains(seed, { ...opts, message: intlMsg('not_contains', { seed }) });

export const Min = (min: number, opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.Min(min, { ...opts, message: intlMsg('min', { min }) });

export const Max = (max: number, opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.Max(max, { ...opts, message: intlMsg('max', { max }) });

export const MinLength = (min: number, opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.MinLength(min, { ...opts, message: intlMsg('min_length', { min }) });

export const MaxLength = (max: number, opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.MaxLength(max, { ...opts, message: intlMsg('max_length', { max }) });

export const MinDate = (date: Date, opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.MinDate(date, { ...opts, message: intlMsg('min_date', { date }) });

export const MaxDate = (date: Date, opts?: classValidator.ValidationOptions): PropertyDecorator =>
  classValidator.MaxDate(date, { ...opts, message: intlMsg('max_date', { date }) });
