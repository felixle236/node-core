# Node Core

Node Core is a NodeJS framework built by cutting edge designs and techniques like clean architecture, domain driven design (DDD), singleton pattern, table inheritance, and more..., it's easy to maintain and expand the system, including the transition from monolithic to microservices. Besides, to increase the performance and stability of the project, the framework is also supported by powerful tools such as Redis, Typescript, Eslint, Grunt, TypeORM,...
Implementing advanced architectures like clean architecture and domain driven design will affect project development time, generator module is a great tool to overcome this problem, it even helps the team reduce development time more than conventional frameworks.

## Features

* Support RESTful API, WebSocket, Swagger UI, Web UI (enable is default).
* Support caching from Redis.
* Support database connection and database migration via TypeORM.
* Support multiple languages.
* Support coding rules with ESLint and auto-fix ESLint by Visual Code.
* Support unit test and coverage.
* Support auto-generating API documentation and expose to Swagger UI.
* Support docker container.
* Support debugger into .ts files directly (ts-node) on Visual Code.
* Support generator module, auto generate a lot of source code.

## Modules Integrated

* User: Register, active account, get profile, update profile,...
* User role: Super Admin, Manager, Client.
* Authorization: Login, forgot password, reset password, change password,...

## Service Integrated

* JSON Web Token (JWT).
* Log Service: LoggingWinston (console log), Aws Cloudwatch, Google Logging (support trace log feature).
* Mail Service: MailConsole (console log), Google SMTP, MailGun, SendInBlue.
* Notification Service: NotificationConsole (console log), NodePushNotification.
* Payment Service: Paypal, Stripe.
* SMS Service: SmsConsole (console log), Twilio, SendInBlue.
* Socket Emitter.
* Storage Service: StorageConsole (console log), MinIO, AwsS3, GoogleStorage.

## Architecture & Design Patterns

- Clean architecture
- Domain driven design (DDD)
- Repository pattern
- Data mapper pattern
- Singleton pattern
- Factory pattern

## Technologies and Tools

- NodeJS
- Typescript
- ExpressJS
- TypeORM
- PostgreSQL (or another database that suppored by TypeORM)
- Redis
- Socket.io
- Routing controllers
- I18n
- Open API 3
- ESLint
- Mocha
- Nyc
- Grunt
- Docker
- Visual Code

## Required

- NodeJS version >= `14.17.x`, current version: NodeJS `v16.13.0` and NPM `v8.1.0` (We can install global `n` package to switch NodeJS versions easier).
- Knowledge of Typescript, ES6, TypeORM, PostgreSQL.

## Document Related

- [Typescript](https://github.com/Microsoft/TypeScript#documentation)
- [ES6 - ECMAScript 2015](http://es6-features.org)
- [JavaScript Standard Style](https://standardjs.com/rules.html)
- [TypeORM](https://github.com/typeorm/typeorm) & [Migrations](https://github.com/typeorm/typeorm/blob/master/docs/migrations.md#migrations)
- [Routing controllers](https://github.com/typestack/routing-controllers#routing-controllers)
- [Socket IO](https://web.socket/docs/) & [Emit cheatsheet](https://web.socket/docs/emit-cheatsheet/)

## Source Structure

```sh
- |-- .husky ------------------------------------------// Husky configuration.
- |-- .nyc_output
- |-- .vscode -----------------------------------------// Visual code configuration.
- |-- coverage ----------------------------------------// Data report for testing coverage.
- |-- dist --------------------------------------------// Built from the src directory.
- |-- logs --------------------------------------------// Write logs.
- |-- module-generator --------------------------------// Source templates for creating new module.
- |-- node_modules
- |-- src ---------------------------------------------// Source of development.
- |------ application
- |------------ interfaces
- |------------------ repositories --------------------// Interface of repositories.
- |------------------ services ------------------------// Interface of services.
- |------------ usecases ------------------------------// Business logic.
- |------ config
- |------------ Configuration.ts ----------------------// Define environment variables from .env file.
- |------------ DbConfig.ts ---------------------------// Database configuration.
- |------ domain
- |------------ common
- |------------ entities
- |------------ enums
- |------------ value-objects
- |------ exposes
- |------------ api
- |------------------ [internal] ----------------------// Proposal to define the internal Api for our other services use.
- |------------------ [external] ----------------------// Proposal to define the external Api as a service.
- |------------------ mobile
- |------------------------ controllers ---------------// Navigate for requests.
- |------------------------ middlewares
- |------------------------ ApiAuthenticator.ts
- |------------------------ ApiDocument.ts ------------// Define Api document for mobile Api.
- |------------------------ ApiService.ts -------------// Initialize Api service for mobile Api.
- |------------------ web
- |------------------------ controllers ---------------// Navigate for requests.
- |------------------------ middlewares
- |------------------------ ApiAuthenticator.ts
- |------------------------ ApiDocument.ts ------------// Define Api document for web Api.
- |------------------------ ApiService.ts -------------// Initialize Api service for web Api.
- |------------ [queue] -------------------------------// Proposal to define the queue as the job subscription/consumer.
- |------------ socket
- |------------------ channels ------------------------// Initialize socket connection & event handling.
- |------------------ SocketService.ts ----------------// Initialize socket service.
- |------------ ui
- |------------------ doc -----------------------------// API Document.
- |------------------------ ApiGenerator.ts -----------// Generator Api documents.
- |------------------------ ApiService.ts -------------// Initialize web service for swagger UI.
- |------------------ web -----------------------------// Web UI.
- |------------------------ controllers ---------------// Navigate for requests.
- |------------------------ middlewares
- |------------------------ public
- |------------------------ views
- |------------------------ WebAuthenticator.ts
- |------------------------ WebService.ts -------------// Initialize web service.
- |------ infras
- |------------ data
- |------------------ redis ---------------------------// In-memory database.
- |------------------------ repositories --------------// Execution operations.
- |------------------------ RedisContext.ts
- |------------------------ RedisRegister.ts
- |------------------ typeorm -------------------------// Database.
- |------------------------ entities ------------------// Define database structure.
- |------------------------ migrations ----------------// Database migrations.
- |------------------------ repositories --------------// Execution operations.
- |------------------------ schemas -------------------// Define database schemas.
- |------------------------ transformers --------------// Transform data before insert and after select from database.
- |------------------------ DbConnection.ts
- |------------------------ DbContext.ts
- |------------------------ DbRegister.ts
- |------------------ DataRegister.ts
- |------------ servers
- |------------------ http ----------------------------// Define http server.
- |------------------ socket --------------------------// Define socket server.
- |------------ services
- |------------------ authorization -------------------// Authentication service.
- |------------------ log -----------------------------// Log service.
- |------------------ mail ----------------------------// Mail service.
- |------------------ notification --------------------// Notification service.
- |------------------ payment -------------------------// Payment services.
- |------------------ [queue] -------------------------// Proposal to define the queue service as the job publisher/provider.
- |------------------ sms -----------------------------// SMS service.
- |------------------ socket-emitter ------------------// Socket emitter.
- |------------------ storage -------------------------// Storage service.
- |------------------ ServiceRegister.ts
- |------------ SingletonRegister.ts ------------------// Define singleton and need to load first.
- |------ resources
- |------------ data ----------------------------------// Initialize data.
- |------------ documents -----------------------------// Document files (doc, docx, xls, xlsx, pdf,...).
- |------------ images --------------------------------// Image files (jpg, jpeg, png, gif,...).
- |------ shared --------------------------------------// Common defination.
- |------ utils
- |------ app.ts --------------------------------------// Main application.
- |-- .dockerignore -----------------------------------// Docker ignore configuration.
- |-- .env --------------------------------------------// Configuration cloned from `.env.sample` and we need to add to `.gitignore`.
- |-- .env.sample -------------------------------------// Configuration sample.
- |-- .eslintignore -----------------------------------// Eslint ignore.
- |-- .eslintrc.js ------------------------------------// Eslint configuration.
- |-- .gitignore --------------------------------------// Git ignore configuration.
- |-- .nycrc.json -------------------------------------// Nyc configuration for testing coverage.
- |-- docker-compose.yml ------------------------------// Docker configuration.
- |-- Dockerfile --------------------------------------// Used by `docker-compose.yml`.
- |-- gruntfile.js
- |-- LICENSE
- |-- nodemon.json
- |-- package-lock.json -------------------------------// Lock package version and should not add to `.gitignore`.
- |-- package.json
- |-- README.md ---------------------------------------// `IMPORTANT` to start the project.
- |-- tsconfig.json -----------------------------------// Typescript configuration.
```

## NPM Commands

```s
npm run generate:apidoc -----------------------// Generate the API documentation.
npm run generate:module {param} ---------------// Generate module or sub-module: entity, schema, repository, usecase, controller,.... Please refer to "Generate Module" section below.
npm run generate:usecase {param} --------------// Generate usecase for module or sub-module. Please refer to "Generate Module" section below.
npm run cache:clear ---------------------------// Clear cache of TypeORM.
npm run migration:generate {Migration_Name} ---// Generate migration for updating database structure.
npm run migration:create {Migration_Name} -----// Create a new empty migration.
npm run migration:up --------------------------// Run the next migrations.
npm run migration:down ------------------------// Revert a previous migration.
npm run lint
npm run build ---------------------------------// Build source before start with production environment.
npm test --------------------------------------// Start unit test and coverage report.
npm run dev -----------------------------------// Start with local environment (NODE_ENV into .env file).
npm start -------------------------------------// Start with production environment (NODE_ENV into .env file), we can change variable for each environment as development, test, staging,....
```

## Grunt Commands

```s
./node_modules/.bin/grunt clean ---------------// Remove "dist" folder.
./node_modules/.bin/grunt sync ----------------// Copy all resource files to dist without extension ".ts".
```

## Debug on Visual Code

* Press F5: build & start with debug mode.
* Debugging in .ts files.

## Quick Start

> Please make sure PostgreSQL & Redis services is running. You can use [docker PostgreSQL](https://github.com/felixle236/docker-postgresql) & [docker Redis](https://github.com/felixle236/docker-redis).

Clone `.env.sample` to `.env` in the same directory and update configuration for project.
Install the npm package:

```
npm install
```

Run the migration for updating database structure (need to create database before):

```
npm run migration:up
```

Run the below command for starting with development mode (or start debug on Visual Code), NODE_ENV will be `local` (NODE_ENV into .env file):

```
npm run dev
```

Also you can run test command and enjoy:

```
npm test
```

## Deploy to server

- We must modify environment variables into `.env` on server and run the commands below:
```
- npm install
- npm run lint
- npm run build
- npm run generate:apidoc
- npm test
- npm run migration:up
- npm start
```

> We can custom the start command above for each environment as dev, test, staging and production.

## Deploy to server into docker container

- We must modify environment variables into `.env` on server and run the commands below:
- And run `docker system prune -f && docker-compose build && docker-compose up -d`.
- To run migration while server running or pipeline deployment: `docker-compose exec -T web-api npm -- run migration:up`.

> Please make sure you have installed Docker and Docker Compose. You can refer to docker compose document in [here](https://docs.docker.com/compose/overview/#compose-documentation).

## Generate Module

- This feature is very useful. It helps developers to reduce a part of development time.
- Create `Product` module, you can try: `npm run generate:module Product`. It will generate entity, schema, repository, usecase, controller,....There are some expose types of the API such as `web`, `mobile`, `internal`, `external`. For another example: `npm run generate:module Product` or define expose api folder: `npm run generate:module Product Api#Mobile`, `Api#Web` param will be added as default.
- Create sub module as `ProductCategory` into `Product` module: `npm run generate:module Product#ProductCategory`. It will generate entity, schema, repository, usecase, controller,...into `Product` module (`product` folders).
- Create `FindProductByCategory` usecase: `npm run generate:usecase Product Find#FindProductByCategory`. It will generate that usecase only. We have 5 method templates: `Find`, `Get`, `Create`, `Update`, `Delete`.
- Create `CreateProductCategoryByOwner` usecase for sub-module `ProductCategory` into `Product` module: `npm run generate:usecase Product#ProductCategory Create#CreateProductCategoryByOwner`.

> After generate the module or usecase, we need to modify the content of them suited for.

## Configuration

- `.env` file is main configuration created by `.env.sample`.
- `.dockerignore` is Docker ignore configuration.
- `docker-compose.yml` is Docker configuration.
- `Dockerfile` is Docker script for build image.
- `.eslintrc.js` is Eslint configuration.
- `.gitignore` is Git ignore configuration.
- `.nycrc.json` is Nyc configuration for testing coverage.
- `tsconfig.json` is Typescript configuration.

> If server PostgreSQL is running on the same server Web API and start with docker, you must set `DB_HOST` environment is service name of PostgreSQL container as `DB_HOST=postgresql` and the same with Redis, MinIO.

> If server PostgreSQL is running on the same server Web API and start without docker, you must set `DB_HOST` environment is `localhost` and the same with Redis, MinIO.

## Data Storage

- PostgreSQL is default database that used in this project. If you want to use the other database, please refer to [TypeORM](https://github.com/typeorm/typeorm), [data type](https://github.com/typeorm/typeorm/blob/master/test/functional/database-schema/column-types/postgres/entity/Post.ts), [joining relations](https://github.com/typeorm/typeorm/blob/master/docs/select-query-builder.md#joining-relations)
- Redis is memory database that we use to increase performance.

## Data Caching

- Default this project is using Redis for data caching. It helps greatly increase the number of large requests to less changing data.
> But don't forget to set expire time and clear cache if have any update on the data related. Refer to [TypeORM Caching](https://github.com/typeorm/typeorm/blob/master/docs/caching.md).
- To clear cache, execute command `await this.dbContext.clearCaching('key')`, we also use typeorm `typeorm cache:clear` or use npm `npm run cache:clear` for clearing all data caching.

## Multiple Languages

- The default language used is English, to use multiple languages we need to update the configuration at `src/shared/localization/index.ts`. Refer to [I18n](https://www.npmjs.com/package/i18n).
- When we want to add error/mail/sms content, we need to add the required language files like `en.json`.

#### Usage for errors:
```
// Define new error:
export class MessageError {
   ...
   static PARAM_NOT_FOUND = new ErrorObject(ErrorCode.DATA_NOT_FOUND, '%s_not_found');
   ...
}
```
```
// Define new key message and label for translation:
{
   ...
   "message": {
      ...
      "%s_not_found": "%s not found",
      ...
   },
   ...
   "label": {
      ...
      "data": "data",
      ...
   },
   ...
}
```
```
// To use translation, the key label should passed into `t` field:
throw new LogicalError(MessageError.PARAM_NOT_FOUND, { t: 'data' });

// With this case, 'count' and '10' will be passed without translation:
throw new LogicalError(MessageError.PARAM_MAX_NUMBER, 'count', 10);
```
```
// Execute translation is called into ErrorMiddleware:
error.translate(req.__);
```
#### Usage for validation errors:
```
// Define new validation decorator into ValidationDecorator:
...
export const IsEmail = (eOpts?: ValidatorJS.IsEmailOptions, opts?: classValidator.ValidationOptions): PropertyDecorator =>
    classValidator.IsEmail(eOpts, { ...opts, message: intlMsg('is_email') });
...
```
```
// Define new key validation for translation:
{
   "validation": {
      ...
      "is_email": "{{field}} must be an email",
      ...
   },
   ...
}
```
```
// Execute validation
import { IsEmail } from 'shared/decorators/ValidationDecorator';

export class ForgotPasswordByEmailInput {
    @IsEmail()
    email: string;
}
```
#### Usage for mail/sms content:
```
// Define new key mail for translation:
{
   "mail": {
      "account_activation": {
			"greeting": "Hi",
      }
      ...
   },
   ...
}
```
```
// To use translation, we need to import our i18n definition and use the locale variable from request:
import i18n from 'shared/localization';
...
i18n.__({ phrase: 'mail.account_activation.greeting', locale })
```

## Authentication & Authorization

- We are using `JWT` to authenticate user access for http request and socket io. Default we use the authencation signature with `HS256`.
- For each environment, you should change the secret key to another by `AUTH_SECRET_KEY` in `.env`.
- Using the role for checking permission.
- Validate and check permission in controllers and pass user info (user authenticated) into usecase handler (if necessary).
- Usually, we have 3 cases:
   - `Anonymous` (Non-user) to allow access API, we don't need to do anything about permission.
   - `Any user authenticated` to allow access API, just use `@Authorized()` without the role on controller functions.
   - `Any user authenticated and role special` to allow access API, just use `@Authorized(RoleId.SUPER_ADMIN)` or `@Authorized([RoleId.SUPER_ADMIN, RoleId.MANAGER])` on controller functions.
- `@Authorized()` is a method decorator, it will check `authorization` header, if authenticate success then return `UserAuthenticated` object via parameter decorator `@CurrentUser()`. We can use paramter decorator `@UsecaseOptionRequest()` to get `UserAuthenticated` object also.
- `PrivateAccessMiddleware` is a middleware that we can use for the internal Api or private Api, just use `@UseBefore(PrivateAccessMiddleware)` on controller functions.
> `@UsecaseOptionRequest()` decorator is built to assist in retrieving the user authenticated and trace id (trace log) from the API request.

## Logging

- `winston` is designed to be a simple and universal logging library with support for multiple transports.
- `console` is logging default in log service and it will write to log file with `error` level.
- Support API logging middleware to log the request detail as remote ip, http method, endpoint, response size, response status code, latency, headers,...
- Support trace log feature also with `@UsecaseOptionRequest()` decorator, refer to endpoint `POST /v1/auths`.
- We also switch to AWS CloudWatch or Google Logging by change the configuration of environment `LOG_PROVIDER` in `.env`.
- Refer with values `WINSTON (1) - AWS_WINSTON (2) - GOOGLE_WINSTON (3)`.

## File Storage

- `console` is configuration default in storage service, we don't refer to store the file in the same server that we use to serve this project.
- We can use [Minio](https://github.com/felixle236/docker-minio) like AWS S3 to store the file go to cloud.
- We also switch to AWS S3 by change the configuration of environment `STORAGE_PROVIDER` in `.env`.
- Refer with values `CONSOLE (1) - MINIO (2) - AWS_S3 (3) - GOOGLE_STORAGE (4)`.

## Send Mail Template

- We are using `mailgen` package to generate the mail template. There are a lot of the mail template to use, refer to [mailgen](https://github.com/eladnava/mailgen).
- We can use Google SMTP, Mailgun, SendInBlue to send mail by change the configuration of environment `MAIL_PROVIDER` in `.env`. Also you can integrate another service that you want to use.
- Refer with values `CONSOLE (1) - GOOGLE_SMTP (2) - MAILGUN (3) - SEND_IN_BLUE (4)`.

## Common Type

- Define common type into `src/shared/types`. We can use enum/type/interface to define them.
- Why do we use the enum type?
   > Define a serial of data in a column in the database that we can identify earlier. Ex: RoleId, OrderStatus, InvoiceStatus, AccountType,....
   > It will be easier to understand and maintain your source code. Please take a look and compare them: `if (order.status === OrderStatus.Draft)` vs `if (order.status === 1)`, `order.status = OrderStatus.Processing` vs `order.status = 2`.

- The advice is that you should use a starting value of `1` if you are using the number data type. It will be easier to validate the data input. Ex: `if (!data.status) throw new LogicalError(MessageError.PARAM_REQUIRED, { t: 'order_status' });`

## Exception

We should define message error into `src\shared\exceptions\message\MessageError.ts`. Ex:
```
static SOMETHING_WRONG = new ErrorObject(ErrorCode.SOMETHING_WRONG, 'something_went_wrong');

static UNKNOWN = new ErrorObject(ErrorCode.UNKNOWN, 'unknown');

static INPUT_VALIDATION = new ErrorObject(ErrorCode.VALIDATION, 'invalid_data_check_fields_property_for_more_info');

static PARAM_NOT_SUPPORTED = new ErrorObject(ErrorCode.NOT_SUPPORTED, '%s_is_not_supported');

static UNAUTHORIZED = new ErrorObject(ErrorCode.UNAUTHORIZED, 'unauthorized');
static ACCESS_DENIED = new ErrorObject(ErrorCode.ACCESS_DENIED, 'access_is_denied');

static DATA_NOT_FOUND = new ErrorObject(ErrorCode.DATA_NOT_FOUND, 'data_not_found');
static PARAM_NOT_FOUND = new ErrorObject(ErrorCode.DATA_NOT_FOUND, '%s_not_found');
```

Usage:
```
import { AccessDeniedError } from 'shared/exceptions/AccessDeniedError';
import { UnauthorizedError } from 'shared/exceptions/UnauthorizedError';
import { MessageError } from 'shared/exceptions/message/MessageError';
import { NotFoundError } from 'shared/exceptions/NotFoundError';
import { LogicalError } from 'shared/exceptions/LogicalError';
....
throw new AccessDeniedError();
throw new NotFoundError();
throw new UnauthorizedError(MessageError.PARAM_EXPIRED, 'token');
throw new UnauthorizedError(MessageError.PARAM_INVALID, { t: 'token' });
throw new LogicalError(MessageError.PARAM_LEN_LESS_OR_EQUAL, { t: 'name' }, 30);
```

> If you got error with status code 500, it's system error or logical error. Almost, this error is your source code, you need to find and fix it soon.

## Data Transformer

- If you use column numeric type in PostgreSQL, it will return a string (not number) into select query, you should use transformer option to convert to number. Ex: `@Column('numeric', { transformer: new NumericTransformer() })`

## Database Execution

- Default TypeORM is using connection pool, it will auto connect and release connection when we execute database query except manual connect with QueryRunner, we must execute connect and release commands manually.
- We should use QueryBuilder for database execution, it will select and map to entity object.
- To use database transaction:
```
@Inject(InjectDb.DbContext)
private readonly _dbContext: IDbContext;

or

constructor(
   @Inject(InjectDb.DbContext) private readonly _dbContext: IDbContext
) {}
....

await this._dbContext.runTransaction(async querySession => {
   const user = await this.userRepository.getByEmail(item.email, querySession);
   // Handle something here.

   const id = await this.userRepository.create(user, querySession);
   // Handle something here.

});

await this._dbContext.runTransaction(async querySession => {
   const user = await this.userRepository.getByEmail(item.email, querySession);
   // Handle something here.

   const id = await this.userRepository.create(user, querySession);
   // Handle something here.

}, async (err) => {
   // Handle something after rollback.

}, async () => {
   // Handle something after committed.

});
```

## Database Migration

- Database Migrations, a technique to help us keep our database changes under control. Database migration is the process of transforming data between various states without any human interaction. This process will allow us to track changes between schema updates.

- In a production environment, where data is already in the DB, we may have to migrate those as well. Same cases apply to testing and staging environments but production is a more fragile universe where mistakes are not forgiven. Say we need to split the Name field of our Users table into a First/Last Name fields combination. One approach would be to create a field called Last Name. Traverse the table, split the Name into two chunks and move the latter to the newly created field. Finally, rename the Name field into First Name. This is a case of data migrations.

- To generate new migration:
```
npm run migration:generate Migration_Name
```
> Migration_Name should be named full meaning. Ex: Create_Table_Customer, Add_Field_Email_In_Customer, Modify_Field_Email_In_Customer, Migrate_Old_Data_To_New_Data,....

- To create a new empty migration:
```
npm run migration:create Migration_Name
```

- To run the next migrations:
```
npm run migration:up
```

- To revert back a previous migration:
```
npm run migration:down
```

## API Response Format

- Return error object [UnauthorizedError] with status code 401 and error code is "UNAUTHORIZED_ERR", this is handler of routing-controllers package.
```
Request:
curl -X 'POST' \
   'http://localhost:3000/api/v1/me/avatar' \
   -H 'accept: application/json' \
   -d ''

Response:
Status code: 401 Unauthorized
{
   "code": "UNAUTHORIZED_ERR",
   "message": "unauthorized"
}
```

- Return error object [AccessDeniedError] with status code 403 and error code is "ACCESS_DENIED_ERR", this is handler of routing-controllers package.
```
Request:
curl -X 'GET' \
   'http://localhost:3000/api/v1/managers/' \
   -H 'accept: application/json' \
   -H 'Authorization: Bearer eyJhbGciOiJIUz...'

Response:
Status code: 403 Forbidden
{
   "code": "ACCESS_DENIED_ERR",
   "message": "access is denied"
}
```

- Return error object [NotFoundError] with status code 404 and error code is "DATA_NOT_FOUND_ERR", this is handler of routing-controllers package.
```
Request:
curl -X 'GET' \
   'http://localhost:3000/api/v1/clients/3fa85f64-5717-4562-b3fc-2c963f66afa6' \
   -H 'accept: application/json' \
   -H 'Authorization: Bearer eyJhbGciOiJIUz...'

Response:
Status code: 404 Not Found
{
   "code": "DATA_NOT_FOUND_ERR",
   "message": "data not found"
}
```

- Return error object [LogicalError] with status code 400, this is logic handler.
```
Request:
curl -X 'POST' \
   'http://localhost:3000/api/v1/auths/login' \
   -H 'accept: application/json' \
   -H 'Content-Type: application/json' \
   -d '{
   "email": "user@example.com",
   "password": "string"
}'

Response:
Status code: 400 Bad Request
{
   "code": "DATA_INCORRECT_ERR",
   "message": "email or password is incorrect!"
}
```

- Return error object [InputValidationError] with status code 400 and error code is "VALIDATION_ERR", this is logic handler.
```
Request:
curl -X 'POST' \
   'http://localhost:3000/api/v1/auths/login' \
   -H 'accept: application/json' \
   -H 'Content-Type: application/json' \
   -d ''

Response:
Status code: 400 Bad Request
{
   "code": "VALIDATION_ERR",
   "message": "invalid data, check 'fields' property for more info",
   "fields": [
      {
         "name": "email",
         "message": "email must be an email"
      },
      {
         "name": "password",
         "message": "password must be a string"
      }
   ]
}
```

- Return data pagination with status code 200.
```
Request:
curl -X 'GET' \
   'http://localhost:3000/api/v1/clients/' \
   -H 'accept: application/json' \
   -H 'Authorization: Bearer eyJhbGciOiJIUz...'

Response:
Status code: 200 OK
{
   "pagination": {
      "skip": 0,
      "limit": 10,
      "total": 2
   },
   "data": [
      {
         "id": ...,
         "name": ...
      },
      {
         "id": ...,
         "name": ...
      }
   ]
}
```

- Return data object with status code 200.
```
Request:
curl -X 'GET' \
   'http://localhost:3000/api/v1/clients/3fa85f64-5717-4562-b3fc-2c963f66afa6' \
   -H 'accept: application/json' \
   -H 'Authorization: Bearer eyJhbGciOiJIUz...'

Response:
Status code: 200 OK
{
   "data": {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "firstName": "Customer",
      "lastName": "Test"
   }
}
```

- Return data object for bulk action with status code 200.
```
Request:
curl -X 'POST' \
   'http://localhost:3000/api/v1/test' \
   -H 'accept: application/json' \
   -H 'Authorization: Bearer eyJhbGciOiJIUz...'

Response:
Status code: 200 OK
{
   "data": {
      "total": 10,
      "successes": 2,
      "ignores": 4,
      "failures": 4,
      "successItems": [],
      "ignoreItems": [],
      "failureItems": []
   }
}
```

- Return string data with status code 200.
```
Request:
curl -X 'POST' \
   'http://localhost:3000/api/v1/managers/' \
   -H 'accept: application/json' \
   -H 'Authorization: Bearer eyJhbGciOiJIUz...' \
   -H 'Content-Type: application/json' \
   -d '{
   "firstName": "Manager",
   "lastName": "Test",
   "email": "manager@localhost.com",
   "password": "Nodecore@2"
}'

Response:
Status code: 200 OK
{
   "data": "e240cbbe-5065-413c-8f1e-3f11f9711c59"
}
```

- Return boolean data with status code 200.
```
Request:
curl -X 'PATCH' \
   'http://localhost:3000/api/v1/auths/password' \
   -H 'accept: application/json' \
   -H 'Authorization: Bearer eyJhbGciOiJIUz...' \
   -H 'Content-Type: application/json' \
   -d '{
   "oldPassword": "string",
   "password": "string"
}'

Response:
Status code: 200 OK
{
   "data": true
}
```

## Naming Rules For API

- `GET`: Used to get the data, it can be the data list, object, number,....

```
GET http://localhost:3000/api/v1/clients                        --> Find client and return the client list.
GET http://localhost:3000/api/v1/clients?keyword=felix          --> Find client with name and return the client list.
GET http://localhost:3000/api/v1/clients/{:id}                  --> Get client with client id and return the client object.
GET http://localhost:3000/api/v1/clients/{:id}/profile          --> Get profile of client with client id and return the profile object.
GET http://localhost:3000/api/v1/clients/profile                --> Get my profile of client that client have authenticated and return the profile object.
```

- `POST`: Used to create new resource, add a child resource, upload file, requests the creation of an activation.

```
POST http://localhost:3000/api/v1/auths/login                   --> Login request.
POST http://localhost:3000/api/v1/me/avatar                     --> Upload my avatar.
POST http://localhost:3000/api/v1/clients                       --> Create client.
POST http://localhost:3000/api/v1/clients/register              --> Register new client.
POST http://localhost:3000/api/v1/clients/active                --> Request active client.
POST http://localhost:3000/api/v1/clients/resend-activation
POST http://localhost:3000/api/v1/auths/forgot-password
```

- `PUT`: Used to create new resource or update (replace object) if it already exists, replace the entire using the data specified in request.

```
PUT http://localhost:3000/api/v1/clients/{:id}                  --> Update client object with client id.
PUT http://localhost:3000/api/v1/auths/reset-password           --> Reset my password.
```

- `PATCH`: Used only to update some fields with record id. Besides, it's just about the meaning, sometime it's very difficult to recognize the boundary, we can use `PUT` instead of `PATCH`.

```
PATCH http://localhost:3000/api/v1/auths/password               --> Update my password.
```

- `DELETE`: Used to delete, remove item, disable, inactive,....

```
DELETE http://localhost:3000/api/v1/clients/{:id}               --> Delete client.
```

## Other Experiences

- Order of development:
   - Domain
      - Entities
      - Enums
      - ValueObject
   - Application
      - Interfaces
         - Repositories
         - Services
      - Usecases
   - Infrastructure
      - Data (typeorm/redis)
         - Schemas
         - Entities
         - Repositories
         - Migrations
      - Services
   - Expose
      - API
      - Socket
      - ....

- API controllers order should be arranged in turn according to GET, POST, PUT, PATCH, DELETE.
- The function order should be arranged in turn according to find, get, check, create, update, delete, remove.
- The query param (url-path?param1=&param2=) will be a string value, if you want to get another type (boolean, number,...), you need to parse them with decorator like `@IsBoolean()` into QueryInput object.
- If we use the table inheritance then we shouldn't use the enum type for parent table in database schema and we shouldn't define the foreign key of the other tables to this parent table, with the logic code is still good. To prevent foreign key definition and keep to use `leftJoinAndSelect` function, we can set `createForeignKeyConstraints` to `false`, for example: `@ManyToOne(() => UserDb, user => user.auths, { createForeignKeyConstraints: false })`.
- With TypeORM version < 0.3.0, there is a bug `Cannot read property 'databaseName' of undefined` when we use `join` + `orderBy` together, please follow this issue in [here](https://github.com/typeorm/typeorm/issues/4270). Temporary [solution](https://github.com/typeorm/typeorm/issues/747#issuecomment-519553920)
