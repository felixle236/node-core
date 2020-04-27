import { createSandbox } from 'sinon';

const sandbox = createSandbox();
sandbox.stub(process, 'env').value({
    ...process.env,

    PROJECT_ID: 'node-core',
    PROJECT_NAME: 'Node Core',
    PROTOTYPE: 'http',
    DOMAIN: 'node-core.com',

    ENABLE_API_SERVICE: true,
    API_PORT: 3000,

    ENABLE_WEB_SERVICE: true,
    WEB_PORT: 4000,

    ENABLE_SOCKET_SERVICE: true,
    SOCKET_PORT: 5000,

    ENABLE_WRITE_LOG: false,
    ENABLE_DATA_LOGGING: false,
    ENABLE_QUERY_LOGGING: false,

    DB_TYPE: '',
    DB_HOST: '',
    DB_PORT: 0,
    DB_NAME: '',
    DB_USER: '',
    DB_PASS: '',

    REDIS_CONFIG_HOST: 'redis.node-core.com',
    REDIS_CONFIG_PORT: 80,

    AUTH_SIGNATURE: 'HS256',
    AUTH_SECRET_KEY: 'SECRET_KEY',

    STORAGE_TYPE: 1,
    BUCKET_NAME: 'bs',

    MINIO_CONFIG_HOST: '',
    MINIO_CONFIG_PORT: 0,
    MINIO_USE_SSL: false,
    MINIO_ACCESS_KEY: '',
    MINIO_SECRET_KEY: '',

    S3_REGION: '',
    S3_ACCESS_KEY: '',
    S3_SECRET_KEY: '',

    MAIL_TYPE: 0,
    MAIL_SENDER_NAME: '',
    MAIL_SENDER_EMAIL: '',

    GOOGLE_SMTP_USERNAME: '',
    GOOGLE_SMTP_PASSWORD: '',

    SENDINBLUE_API_KEY: '',

    SMS_TYPE: 0,
    SMS_SENDER_NAME: '',

    PAYMENT_TYPE: 0,
    STRIPE_KEY: '',
    PAYPAL_KEY: '',

    ENABLE_NOTIFICATION: false,
    ANDROID_KEY: '',
    IOS_KEY: ''
});
