# Node Core
The NodeJS framework is built with Clean Architecture, using NodeJS, Typescript, ExpressJS, TypeORM, PostgreSQL, Redis, etc... Easy to expand and maintain.

* Integrated modules: role, user, authentication.
* Use data caching to improve performance. Cache into database or Redis.
* Use coding rules with ESLint.
* Build quickly with the generate module feature.
* Realtime with Socket IO.
* Easy maintenance and expansion.
* Easy to deploy with docker container.
* Run & debug on .ts files by Visual Code.
* Unit test & coverage.
* Database migration.
* Demo table inheritance, refer to `Experiences` below of this guide and branch `feature/table-inheritance`.

### Patterns and Principles

- Clean architecture design pattern
- Repository pattern
- CQRS pattern
- Transfer object pattern
- Data mapper pattern
- Singleton pattern
- Factory pattern

### Technologies and Tools

- NodeJS
- Typescript
- ExpressJS
- TypeORM
- PostgreSQL
- Redis
- Socket.io
- ESLint
- Mocha
- Nyc
- Grunt
- Docker
- Docker Compose
- Visual Code

### Required

- NodeJS (version >= 12.9.0)
- Knowledge of Typescript, ES6, TypeORM, PostgreSQL.

### Document Related

- [Typescript](https://github.com/Microsoft/TypeScript#documentation)
- [ES6 - ECMAScript 2015](http://es6-features.org)
- [JavaScript Standard Style](https://standardjs.com/rules.html)
- [TypeORM](https://github.com/typeorm/typeorm) & [Migrations](https://github.com/typeorm/typeorm/blob/master/docs/migrations.md#migrations)
- [Routing controllers](https://github.com/typestack/routing-controllers#routing-controllers)
- [Socket controllers](https://github.com/typestack/socket-controllers#socket-controllers)
- [Socket IO](https://web.socket/docs/) & [Emit cheatsheet](https://web.socket/docs/emit-cheatsheet/)

### Source Structure

```sh
- |-- .nyc_output
- |-- .vscode ----------------------------------// Visual code configuration.
- |-- coverage ---------------------------------// Data report for testing coverage.
- |-- dist -------------------------------------// Built from the src directory.
- |-- logs -------------------------------------// Write logs.
- |-- module-generator -------------------------// Source templates for creating new module.
- |-- node_modules
- |-- src --------------------------------------// Source of development.
- |------ configs
- |------------ Configuration.ts ---------------// Define environment variables from .env file.
- |------------ ServiceProvider.ts -------------// Define service provider.
- |------ libs
- |------ resources
- |------------ data ----------------------------// Initialize data.
- |------------ documents -----------------------// Document files (doc, docx, xls, xlsx, pdf,...).
- |------------ images --------------------------// Image files (jpg, jpeg, png, gif,...).
- |------ web.api
- |------------ controllers ---------------------// Navigate for requests.
- |------------ interceptors
- |------------ middlewares
- |------------------ BodyParserMiddleware.ts ---// Body parser.
- |------------------ ErrorMiddleware.ts --------// Handling of errors.
- |------------------ LoggingMiddleware.ts ------// Logs, track requests.
- |------------ ApiAuthenticator.ts
- |------------ ApiService.ts -------------------// Initialize Api service.
- |------ web.core
- |------------ domain
- |------------------ common
- |------------------ entities
- |------------------ enums
- |------------------ types
- |------------ gateways
- |------------------ repositories --------------// Interface of repositories.
- |------------------ services ------------------// Interface of services.
- |------------ interactors ---------------------// Business logic (usecase).
- |------ web.infrastructure
- |------------ databases -----------------------// Data storage services.
- |------------------ redis ---------------------// In-memory database service.
- |------------------------ repositories --------// Execution operations.
- |------------------------ RedisContext.ts
- |------------------------ RedisRegister.ts
- |------------------ typeorm -------------------// Database service.
- |------------------------ entities ------------// Define database structure.
- |------------------------ migrations ----------// Database migrations.
- |------------------------ repositories --------// Execution operations.
- |------------------------ schemas -------------// Define database schemas.
- |------------------------ transformers --------// Transform data before insert and after select from database.
- |------------------------ DbConnection.ts
- |------------------------ DbContext.ts
- |------------------------ DbRegister.ts
- |------------------ DatabaseRegister.ts
- |------------ servers
- |------------------ http ----------------------// Define http server.
- |------------------ socket --------------------// Define socket server.
- |------------ services
- |------------------ auth ----------------------// Authentication service.
- |------------------ log -----------------------// Log service.
- |------------------ mail ----------------------// Mail service.
- |------------------ notification --------------// Notification service.
- |------------------ payment -------------------// Payment services.
- |------------------ sms -----------------------// SMS service.
- |------------------ storage -------------------// Storage service.
- |------------------ ServiceRegister.ts
- |------------ SingletonRegister.ts ------------// Define singleton and need to load first.
- |------ web.socket
- |------------ controllers ---------------------// Navigate for requests.
- |------------ SocketService.ts ----------------// Initialize socket service
- |------ web.ui
- |------------ controllers ---------------------// Navigate for requests.
- |------------ middlewares
- |------------ public
- |------------ views
- |------------ WebAuthenticator.ts
- |------------ WebService.ts -------------------// Initialize web service.
- |------ app.ts --------------------------------// Main application.
- |-- .dockerignore -----------------------------// Docker ignore configuration.
- |-- .env --------------------------------------// Configuration cloned from `.env.sample` and we need to add to `.gitignore`.
- |-- .env.sample -------------------------------// Configuration sample.
- |-- .eslintignore -----------------------------// Eslint ignore.
- |-- .eslintrc.js ------------------------------// Eslint configuration.
- |-- .gitignore --------------------------------// Git ignore configuration.
- |-- .nycrc.json -------------------------------// Nyc configuration for testing coverage.
- |-- docker-compose.yml ------------------------// Docker configuration.
- |-- Dockerfile --------------------------------// Used by `docker-compose.yml`.
- |-- gruntfile.js
- |-- nodemon.json
- |-- ormconfig.js ------------------------------// TypeORM configuration, this file only use for running migration commands.
- |-- package.json
- |-- package-lock.json -------------------------// Lock package version.
- |-- README.md ---------------------------------// `IMPORTANT` to start the project.
- |-- tsconfig.json -----------------------------// Typescript configuration.
```

### NPM Commands

```s
npm run cache:clear -------------------------------// Clear cache of TypeORM.
npm run migration:generate {Migration_Name} -------// Generate migration for update database structure.
npm run migration:run -----------------------------// Run the next migrations for update database structure.
npm run migration:revert --------------------------// Revert migration for update database structure.
npm run generate:module {ModuleName} --------------// Generate module: entity, schema, repository, interactor, controller,....
npm run lint
npm run build -------------------------------------// Build source before start with production environment.
npm test ------------------------------------------// Start unit test.
npm run dev ---------------------------------------// Start with development environment.
npm start -----------------------------------------// Start with production environment.
```

### Grunt Commands

```s
./node_modules/.bin/grunt clean ---------------------------// Remove "dist" folder.
./node_modules/.bin/grunt sync ----------------------------// Copy all resource files to dist without extension ".ts".
```

### Debug on Visual Code

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
npm run migration:run
```

Run the below command for starting with development mode (or debug by visual code):

```
npm run dev
```

Also you can run test command and enjoy:

```
npm test
```

### Deploy to server

- We must modify environment variables into `.env` on server.
- And run `docker system prune -f && docker-compose build && docker-compose up -d`.
- To run migration while server running: `docker-compose exec -T web-api npm -- run migration:run`.

> Please make sure you have installed Docker and Docker Compose. You can refer to docker compose document in [here](https://docs.docker.com/compose/overview/#compose-documentation).

### Setup auto deployment

- You should setup the testing step for make sure anything is good. Example:
```
- npm install
- npm run build
- npm test (unit test)
- npm run migration:run
```

- Refer the gitlab deployment steps like below:
```
- apk add --update openssh # Use this command for Alpine Linux
- ssh $STAG_USER@$STAG_ADDR "cd $STAG_PROJECT_PATH && git pull && docker system prune -f && docker-compose build && docker-compose up -d && exit;"
```

### Generate Module

- This feature is very useful. It helps developers to reduce a part of development time.
- If you want to create module Client, you can execute: `npm run generate:module Client`. It will generate entity, schema, repository, interactor, controller,....

### Configuration

- `.env` file is main configuration created by `.env.sample`.
- `.dockerignore` is Docker ignore configuration.
- `docker-compose.yml` is Docker configuration.
- `Dockerfile` is Docker script for build image.
- `.eslintrc.js` is Eslint configuration.
- `.gitignore` is Git ignore configuration.
- `.nycrc.json` is Nyc configuration for testing coverage.
- `ormconfig.js` is TypeORM configuration.
- `tsconfig.json` is Typescript configuration.

> If server PostgreSQL is running on the same server Web API and start with docker, you must set `DB_HOST` environment is service name of PostgreSQL container as `DB_HOST=postgresql` and the same Redis, MinIO.

> If server PostgreSQL is running on the same server Web API and start without docker, you must set `DB_HOST` environment is `localhost` and the same Redis, MinIO.

### Data Storage

- PostgreSQL is default database that used in this project. If you want to use the other database, please refer to [TypeORM](https://github.com/typeorm/typeorm).
- Redis is memory database that we use to increase performance.

### Data Caching

- Default this project is using Redis for data caching. It helps greatly increase the number of large requests to less changing data.
> But don't forget to set expire time and clear cache if have any update on the data related. Refer to [TypeORM Caching](https://github.com/typeorm/typeorm/blob/master/docs/caching.md).
- Currently we are caching role list. You can refer to function `getAll` of `RoleRepository`.
- To clear cache, execute command `await this.dbContext.clearCaching('roles')`, we also use typeorm `typeorm cache:clear` or use npm `npm run cache:clear` for clearing all data caching.

### Authentication

- We are using `JWT` to authenticate user access for http request and socket io.
- Default we use the authencation signature with `HS256`.
- For each environment, you should change the secret key to another by `AUTH_SECRET_KEY` in `.env`.

### File Storage

- Default we don't want to store the file in the same server that we use to serve this project.
- We can use [Minio](https://github.com/felixle236/docker-minio) like AWS S3 to store the file go to cloud.
- We also switch to AWS S3 by change the configuration of environment `STORAGE_PROVIDER` in `.env`.
- Refer with values `CONSOLE (1) - MINIO (2) - AWS_S3 (3) - GOOGLE_STORAGE (4)`.

### Send Mail Template

- We are using `mailgen` package to generate the mail template. There are a lot of the mail template to use, refer to [mailgen](https://github.com/eladnava/mailgen).
- We can use Google SMTP or SendInBlue to send mail by change the configuration of environment `MAIL_PROVIDER` in `.env`. Also you can integrate another service that you want to use.
- Refer with values `CONSOLE (1) - GOOGLE_SMTP (2) - SEND_IN_BLUE (3)`.

### Common Type

- Define enum type into `src/configs/ServiceProvider.ts`. It can be a number or a string.
- When do we use the enum type in our project?
   > Define a serial of data in a column in the database that we can identify earlier. Ex: RoleId, OrderStatus, InvoiceStatus, AccountType,....

- Why do we use the enum type?
   > It will be easier to understand and maintain your source code. Please take a look and compare them: `if (order.status === OrderStatus.Draft)` vs `if (order.status === 1)`, `order.status = OrderStatus.processing` vs `order.status = 2`.

- The advice is that you should use a starting value of `1` if you are using the number data type. It will be easier to validate the data input. Ex: `if (!data.status) throw new SystemError(MessageError.PARAM_REQUIRED, 'order status');`

### Error Handler

We should define message error into `src\web.core\domain\common\exceptions\message\MessageError.ts`. Ex:
```
static SOMETHING_WRONG = new ErrorObject(ErrorCode.SOMETHING_WRONG, 'Something went wrong!');

static NOT_SUPPORTED = new ErrorObject(ErrorCode.NOT_SUPPORTED, 'The {0} is not supported!');

static ACCESS_DENIED = new ErrorObject(ErrorCode.ACCESS_DENIED, 'Access is denied!');

static DATA_NOT_FOUND = new ErrorObject(ErrorCode.DATA_NOT_FOUND, 'Data not found!');
static PARAM_NOT_FOUND = new ErrorObject(ErrorCode.DATA_NOT_FOUND, 'The {0} was not found!');

static DATA_CANNOT_SAVE = new ErrorObject(ErrorCode.DATA_CANNOT_SAVE, 'Data cannot save!');

static PARAM_CANNOT_UPLOAD = new ErrorObject(ErrorCode.DATA_CANNOT_UPLOAD, 'The {0} cannot upload!');

static PARAM_REQUIRED = new ErrorObject(ErrorCode.DATA_REQUIRED, 'The {0} is required!');

static PARAM_INCORRECT = new ErrorObject(ErrorCode.DATA_INCORRECT, 'The {0} is incorrect!');
```

Usage:
```
import { MessageError } from '../../../../domain/common/exceptions/message/MessageError';
import { SystemError } from '../../../../domain/common/exceptions/SystemError';
....
throw new SystemError(MessageError.PARAM_REQUIRED, 'id');
throw new SystemError(MessageError.PARAM_REQUIRED, 'permission');
throw new SystemError(MessageError.DATA_NOT_FOUND);
throw new SystemError(MessageError.ACCESS_DENIED);
throw new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'name', 30);
```

> If you got error with status code 500, it's error system. Almost, this error is your source code, you need to find and fix it soon.

### Data Transformer

- If you use column numeric type in PostgreSQL, it will return a string (not number), you should use transformer option to convert to number. Ex: `@Column('numeric', { transformer: new NumericTransformer() })`
- If you have a field `birthday` with data type is string and store into db with data type is Date. Ex: `@Column('date', { name: USER_SCHEMA.COLUMNS.BIRTHDAY, nullable: true, transformer: new DateTransformer() })`

### Database Execution

- Default TypeORM is using connection pool, it will auto connect and release connection when we execute database query except manual connect with QueryRunner, we must execute connect and release commands manually.
- We should use QueryBuilder for database execution, it will select and map to entity object.
- To use database transaction:
```
@Inject('db.context')
private readonly _dbContext: IDbContext;
....
await this._dbContext.getConnection().runTransaction(async queryRunner => {
   const user = await this.userRepository.getByEmail(item.email, queryRunner);
   ....
   const id = await this.userRepository.create(user, queryRunner);
   ....
}, async (err) => {
   // Rollback....
}, async () => {
   // Done!
});
```

### Database Migration

- Database Migrations, a technique to help us keep our database changes under control. Database migration is the process of transforming data between various states without any human interaction. This process will allow us to track changes between schema updates.

- In a production environment, where data is already in the DB, we may have to migrate those as well. Same cases apply to testing and staging environments but production is a more fragile universe where mistakes are not forgiven. Say we need to split the Name field of our Users table into a First/Last Name fields combination. One approach would be to create a field called Last Name. Traverse the table, split the Name into two chunks and move the latter to the newly created field. Finally, rename the Name field into First Name. This is a case of data migrations.

- To generate new migration:
```
npm run migration:generate Migration_Name
```
> Migration_Name should be named full meaning. Ex: Create_Table_Client, Add_Field_Email_In_Client, Modify_Field_Email_In_Client, Migrate_Old_Data_To_New_Data,....

- To run the next migrations for update database structure:
```
npm run migration:run
```

- To revert back the previous migration:
```
npm run migration:revert
```

### Permission

- We are using the role for checking permission.
- We validate and check permission in controllers and pass user info (user authenticated) into interactor handler (if necessary).
- Usually, we have 3 cases:
   - `Anonymous` (Non-user) to allow access API, we don't need to do anything about permission.
   - `Any user authenticated` to allow access API, just use `@Authorized()` without the role on controller functions.
   - `Any user authenticated and role special` to allow access API, just use `@Authorized(RoleId.SUPER_ADMIN)` or `@Authorized([RoleId.SUPER_ADMIN, RoleId.MANAGER])` on controller functions.
- `@Authorized()` is a decorator, it will check `authorization` header, if authenticate success then return `UserAuthenticated` object. Also, we can pass the role in this function for checking. The process will be through the cache first, so the process will be handled very quickly.

### API Response Format

- Return error object [UnauthorizedError] with status code 401, this is handler of routing-controllers package.
```
Request:
curl -i -H Accept:application/json -X GET http://localhost:3000/api/v1/me

Response:
HTTP/1.1 401 Unauthorized
{
   "code": "ACCESS_DENIED_ERR",
   "message": "The token is required!"
}
```

- Return error object [SystemError] with status code 400, this is logic handler.
```
Request:
curl -i -H Accept:application/json -X POST http://localhost:3000/api/v1/auth/login -H Content-Type:application/json -d '{"email": "admin@localhost.com","password": "Nodecore@2"}'

Response:
HTTP/1.1 400 Bad Request
{
   "code": "DATA_INCORRECT_ERR",
   "message": "The email or password is incorrect!",
}
```

- Return data pagination with status code 200.
```
Request:
curl -i -H Accept:application/json -H 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlSWQiOjEs...' -X GET http://localhost:3000/api/v1/roles

Response:
HTTP/1.1 200 OK
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
curl -i -H Accept:application/json -H 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlSWQiOjEs...' -X POST http://localhost:3000/api/v1/users/dummy-clients -H Content-Type:application/json

Response:
HTTP/1.1 200 OK
{
	"data": {
      "total": 9,
      "successes": 0,
      "ignores": 9,
      "failures": 0,
      "failureIndexs": []
	}
}
```

- Return boolean data with status code 200.
```
Request:
curl -i -H Accept:application/json -H 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlSWQiOjEs...' -X DELETE http://localhost:3000/api/v1/roles/{:id} -H Content-Type:application/json

Response:
HTTP/1.1 200 OK
{
   "data": true
}
```

### Naming Rules For API

- `GET`: Used to get the data, it can be the data list, object, number,....

```
GET http://localhost/api/v1/users                         --> Find user and return the user list.
GET http://localhost/api/v1/users?keyword=felix           --> Find user with name and return the user list.
GET http://localhost/api/v1/users/{:id}                   --> Get user with id is 1 and return the user object.
GET http://localhost/api/v1/users/{:id}/role              --> Get role of user with id is 1 and return the role object.
```

- `POST`: Used to create new resource, add a child resource, upload file, requests the creation of an activation.

```
POST http://localhost/api/v1/auth/login                    --> Login request.
POST http://localhost/api/v1/me/avatar                     --> Upload binary file.
POST http://localhost/api/v1/users                         --> Create user.
POST http://localhost/api/v1/register                      --> Register new user.
POST http://localhost/api/v1/active                        --> Request active user.
POST http://localhost/api/v1/resend-activation
POST http://localhost/api/v1/forgot-password
POST http://localhost/api/v1/resend-activation
```

- `PUT`: Used to create new resource or update (replace object) if it already exists, replace the entire using the data specified in request.

```
PUT http://localhost/api/v1/users/{:id}                   --> Update user object with id 1.
PUT http://localhost/api/v1/reset-password                --> Reset password.
```

- `PATCH`: Used only to update some fields with record id. Besides, it's just about the meaning, sometime it's very difficult to recognize the boundary, we can use `PUT` instead of `PATCH`.

```
PATCH http://localhost/api/v1/me/password
```

- `DELETE`: Used to delete, remove item, disable, inactive,....

```
DELETE http://localhost/api/v1/users/{:id}
```

### Experiences

- Order of development:
   - Web Core:
      - Domain
         - Types
         - Entities
         - Enums
      - Interactors
      - Gateways
   - Web Infrastructure
      - Databases (typeorm/redis)
         - Schema
         - Entities
         - Repositories
      - Services
   - Web API:
      - Controllers
   - Web Socket:
      - Controllers
- API controllers order should be arranged in turn according to GET, POST, PUT, PATCH, DELETE.
- The function order should be arranged in turn according to find, get, check, create, update, delete, remove.
- The query param (url-path?param1=&param2=) will be a string value, if you want to get another type (boolean, number,...), you need to parse them with decorator like `@IsBoolean()`. Refer to FindUserQuery.ts file.
- If we use the table inheritance then we shouldn't use the enum type for parent table in database schema, with the logic code is still good.
- Refer the joining relations document to have the best practice: https://github.com/typeorm/typeorm/blob/master/docs/select-query-builder.md#joining-relations