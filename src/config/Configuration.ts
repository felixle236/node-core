/* eslint-disable @typescript-eslint/naming-convention */
import 'shared/types/Global';
import path from 'path';
import dotenv from 'dotenv';
import env from 'env-var';
import { Environment, LogProvider, MailProvider, NotificationProvider, SmsProvider, StorageProvider } from 'shared/types/Environment';

dotenv.config();

// SYSTEM ENVIRONMENT
export const NODE_ENV = env.get('NODE_ENV').required().asString();
const keyEnv = Object.keys(Environment).find((key) => Environment[key] === NODE_ENV);
export const ENVIRONMENT: Environment = keyEnv ? Environment[keyEnv] : Environment.Local;
export const PROJECT_ID = env.get('PROJECT_ID').required().asString();
export const PROJECT_NAME = env.get('PROJECT_NAME').required().asString();
export const PROJECT_PROTOTYPE = env.get('PROJECT_PROTOTYPE').required().asString();
export const PROJECT_DOMAIN = env.get('PROJECT_DOMAIN').required().asString();
export const PROJECT_SUPPORT_NAME = env.get('PROJECT_SUPPORT_NAME').asString();
export const PROJECT_SUPPORT_EMAIL = env.get('PROJECT_SUPPORT_EMAIL').asString();

// WEB API

export const ENABLE_WEB_API = env.get('ENABLE_WEB_API').default(1).asBool();
export const WEB_API_PORT = env.get('WEB_API_PORT').required(ENABLE_WEB_API).asPortNumber();
export const WEB_API_URL = env.get('WEB_API_URL').required(ENABLE_WEB_API).asUrlString();
export const WEB_API_PRIVATE_KEY = env.get('WEB_API_PRIVATE_KEY').required(ENABLE_WEB_API).asString();

// MOBILE API

export const ENABLE_MOBILE_API = env.get('ENABLE_MOBILE_API').default(0).asBool();
export const MOBILE_API_PORT = env.get('MOBILE_API_PORT').required(ENABLE_MOBILE_API).asPortNumber();
export const MOBILE_API_URL = env.get('MOBILE_API_URL').required(ENABLE_MOBILE_API).asUrlString();

// SWAGGER UI

export const ENABLE_SWAGGER_UI = env.get('ENABLE_SWAGGER_UI').default(1).asBool();
export const SWAGGER_UI_PORT = env.get('SWAGGER_UI_PORT').required(ENABLE_SWAGGER_UI).asPortNumber();
export const SWAGGER_UI_URL = env.get('SWAGGER_UI_URL').required(ENABLE_SWAGGER_UI).asUrlString();
export const SWAGGER_UI_BASIC_USER = env.get('SWAGGER_UI_BASIC_USER').required(ENABLE_SWAGGER_UI).asString();
export const SWAGGER_UI_BASIC_PASS = env.get('SWAGGER_UI_BASIC_PASS').required(ENABLE_SWAGGER_UI).asString();
export const SWAGGER_UI_APIS = env.get('SWAGGER_UI_APIS').required(ENABLE_SWAGGER_UI).asArray();

// WEB UI

export const ENABLE_WEB_UI = env.get('ENABLE_WEB_UI').default(0).asBool();
export const WEB_UI_PORT = env.get('WEB_UI_PORT').required(ENABLE_WEB_UI).asPortNumber();
export const WEB_UI_URL = env.get('WEB_UI_URL').required(ENABLE_WEB_UI).asUrlString();

// WEB SOCKET

export const ENABLE_WEB_SOCKET = env.get('ENABLE_WEB_SOCKET').default(1).asBool();
export const WEB_SOCKET_PORT = env.get('WEB_SOCKET_PORT').required(ENABLE_WEB_SOCKET).asPortNumber();
export const WEB_SOCKET_URL = env.get('WEB_SOCKET_URL').required(ENABLE_WEB_SOCKET).asUrlString();

// DATABASE CONFIGURATION

export const DB_TYPE = env.get('DB_TYPE').required().asString();
export const DB_HOST = env.get('DB_HOST').required().asString();
export const DB_PORT = env.get('DB_PORT').required().asPortNumber();
export const DB_NAME = env.get('DB_NAME').required().asString();
export const DB_USER = env.get('DB_USER').required().asString();
export const DB_PASS = env.get('DB_PASS').required().asString();
export const DB_CACHE = env.get('DB_CACHE').default(0).asBool();

// REDIS CONFIGURATION

export const REDIS_URI = env.get('REDIS_URI').required().asString();
export const REDIS_PREFIX = env.get('REDIS_PREFIX').asString();

// DB SOCKET CONFIGURATION

export const SOCKET_REDIS_URI = env.get('SOCKET_REDIS_URI').required().asString();

// AUTHENTICATION SERVICE

export const AUTH_SIGNATURE = env.get('AUTH_SIGNATURE').required().asString();
export const AUTH_SECRET_OR_PRIVATE_KEY = env.get('AUTH_SECRET_KEY').required().asString();
export const AUTH_SECRET_OR_PUBLIC_KEY = env.get('AUTH_SECRET_KEY').required().asString();

// LOG SERVICE

export const LOG_PROVIDER: LogProvider = env.get('LOG_PROVIDER').default(LogProvider.Winston).asIntPositive();

// STORAGE SERVICE

export const STORAGE_PROVIDER: StorageProvider = env.get('STORAGE_PROVIDER').default(StorageProvider.Console).asIntPositive();
export const STORAGE_URL = env
  .get('STORAGE_URL')
  .required(STORAGE_PROVIDER !== StorageProvider.Console)
  .asUrlString();
export const STORAGE_UPLOAD_DIR = env.get('STORAGE_UPLOAD_DIR').default(path.join(__dirname, 'uploads')).asString();
export const STORAGE_BUCKET_NAME = env
  .get('STORAGE_BUCKET_NAME')
  .required(STORAGE_PROVIDER !== StorageProvider.Console)
  .asString();

export const MINIO_HOST = env
  .get('MINIO_HOST')
  .required(STORAGE_PROVIDER === StorageProvider.MinIO)
  .asString();
export const MINIO_PORT = env
  .get('MINIO_PORT')
  .required(STORAGE_PROVIDER === StorageProvider.MinIO)
  .asPortNumber();
export const MINIO_ACCESS_KEY = env
  .get('MINIO_ACCESS_KEY')
  .required(STORAGE_PROVIDER === StorageProvider.MinIO)
  .asString();
export const MINIO_SECRET_KEY = env
  .get('MINIO_SECRET_KEY')
  .required(STORAGE_PROVIDER === StorageProvider.MinIO)
  .asString();
export const MINIO_USE_SSL = env.get('MINIO_USE_SSL').default(0).asBool();

const REQUIRED_GCP_CREDENTIAL = STORAGE_PROVIDER === StorageProvider.GoogleStorage;
export const GOOGLE_STORAGE_LOCATION = env.get('GOOGLE_STORAGE_LOCATION').required(REQUIRED_GCP_CREDENTIAL).asString();
export const GOOGLE_STORAGE_CLASS = env.get('GOOGLE_STORAGE_CLASS').required(REQUIRED_GCP_CREDENTIAL).asString();

// MAIL SERVICE

export const MAIL_PROVIDER: MailProvider = env.get('MAIL_PROVIDER').default(MailProvider.Console).asIntPositive();
export const MAIL_SENDER_NAME = env
  .get('MAIL_SENDER_NAME')
  .required(MAIL_PROVIDER !== MailProvider.Console)
  .asString();
export const MAIL_SENDER_EMAIL = env
  .get('MAIL_SENDER_EMAIL')
  .required(MAIL_PROVIDER !== MailProvider.Console)
  .asString();

export const GOOGLE_SMTP_USERNAME = env
  .get('GOOGLE_SMTP_USERNAME')
  .required(MAIL_PROVIDER === MailProvider.GoogleSmtp)
  .asString();
export const GOOGLE_SMTP_PASSWORD = env
  .get('GOOGLE_SMTP_PASSWORD')
  .required(MAIL_PROVIDER === MailProvider.GoogleSmtp)
  .asString();

export const MAILGUN_DOMAIN = env
  .get('MAILGUN_DOMAIN')
  .required(MAIL_PROVIDER === MailProvider.MailGun)
  .asString();
export const MAILGUN_API_KEY = env
  .get('MAILGUN_API_KEY')
  .required(MAIL_PROVIDER === MailProvider.MailGun)
  .asString();

export const SENDINBLUE_API_KEY = env
  .get('SENDINBLUE_API_KEY')
  .required(MAIL_PROVIDER === MailProvider.SendInBlue)
  .asString();

// SMS SERVICE

export const SMS_PROVIDER: SmsProvider = env.get('SMS_PROVIDER').default(SmsProvider.Console).asIntPositive();
export const SMS_SENDER_OR_PHONE = env
  .get('SMS_SENDER_OR_PHONE')
  .required(SMS_PROVIDER !== SmsProvider.Console)
  .asString();

export const TWILIO_ACCOUNT_SID = env
  .get('TWILIO_ACCOUNT_SID')
  .required(SMS_PROVIDER === SmsProvider.Twilio)
  .asString();
export const TWILIO_AUTH_TOKEN = env
  .get('TWILIO_AUTH_TOKEN')
  .required(SMS_PROVIDER === SmsProvider.Twilio)
  .asString();

// PAYMENT SERVICE

export const STRIPE_KEY = env.get('STRIPE_KEY').default('').asString();
export const PAYPAL_KEY = env.get('PAYPAL_KEY').default('').asString();

// NOTIFICATION SERVICE

export const NOTIFICATION_PROVIDER: NotificationProvider = env.get('NOTIFICATION_PROVIDER').default(NotificationProvider.Console).asIntPositive();
export const FCM_KEY = env
  .get('FCM_KEY')
  .required(NOTIFICATION_PROVIDER !== NotificationProvider.Console)
  .asString();
export const APN_KEY = env
  .get('APN_KEY')
  .required(NOTIFICATION_PROVIDER !== NotificationProvider.Console)
  .asString();

// CLOUD CREDENTIALS

const REQUIRED_AWS_CREDENTIAL = STORAGE_PROVIDER === StorageProvider.AwsS3;
export const AWS_REGION = env.get('AWS_REGION').required(REQUIRED_AWS_CREDENTIAL).asString();
export const AWS_ACCESS_KEY = env.get('AWS_ACCESS_KEY').required(REQUIRED_AWS_CREDENTIAL).asString();
export const AWS_SECRET_KEY = env.get('AWS_SECRET_KEY').required(REQUIRED_AWS_CREDENTIAL).asString();

export const GOOGLE_APPLICATION_CREDENTIALS = env.get('GOOGLE_APPLICATION_CREDENTIALS').required(REQUIRED_GCP_CREDENTIAL).asString();
