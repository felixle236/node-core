# Node Core
The NodeJS framework is built with Clean Architecture, using NodeJS, Typescript, ExpressJS, TypeORM, PostgreSQL, Redis, etc... Easy to expand and maintain.

* Integrated modules: role, user, permission, authentication, message.
* Cache data to improve performance. Can store into database or Redis.
* Build quickly with the generate module feature.
* Use coding rules with ESLint.
* Realtime with Socket IO.
* Easy maintenance and expansion.
* Easy to deploy with docker container.
* Run & debug on .ts files by Visual Code.
* Unit test & coverage.
* Database migration.

### Patterns and Principles

- Clean Architecture Design Pattern
- Repository Pattern
- Transfer Object Pattern
- Data Mapper Pattern
- Singleton Pattern
- Factory Pattern

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

- NodeJS (version >= 8.x)
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
- |-- node_modules
- |-- src --------------------------------------// Source of development.
- |------ constants
- |------------ claims  ------------------------// Define the claim for authentication module.
- |------------ Enums.ts -----------------------// Define the enum, data types.
- |------------ Environments.ts ----------------// Define environment variables from .env file.
- |------------ Messages.ts --------------------// Define message for API response error.
- |------ libs
- |------ resources
- |------------ documents -----------------------// Document files (doc, docx, xls, xlsx, pdf,...).
- |------------ images --------------------------// Image files (jpg, jpeg, png, gif,...).
- |------------ sample-data ---------------------// Initialize sample data.
- |------------ source-templates ----------------// Source templates for generate module.
- |------ test ----------------------------------// Source testing.
- |------ web
- |------------ controllers ---------------------// Navigate for requests.
- |------------ middlewares
- |------------ public
- |------------ views
- |------------ WebAuthenticator.ts
- |------------ WebModule.ts
- |------------ WebService.ts -------------------// Initialize web service.
- |------ web.api
- |------------ controllers ---------------------// Navigate for requests.
- |------------ interceptors
- |------------ middlewares
- |------------------ BodyParserMiddleware.ts ---// Body parser.
- |------------------ ErrorMiddleware.ts --------// Handling of errors.
- |------------------ LoggingMiddleware.ts ------// Logs, track requests.
- |------------ ApiAuthenticator.ts
- |------------ ApiModule.ts
- |------------ ApiService.ts -------------------// Initialize Api service.
- |------ web.core
- |------------ businesses ----------------------// Logical code & business flow.
- |------------ dtos ----------------------------// Data transfer object.
- |------------ interfaces
- |------------ models
- |------------ CoreModule.ts
- |------ web.infrastructure
- |------------ data ----------------------------// Data storage services.
- |------------------ redis ---------------------// In-memory database service.
- |------------------------ repositories --------// Execution operations.
- |------------------------ RedisContext.ts
- |------------------------ ServiceRegister.ts
- |------------------ typeorm -------------------// Database service.
- |------------------------ entities ------------// Define database structure.
- |------------------------ migrations ----------// Database migrations.
- |------------------------ repositories --------// Execution operations.
- |------------------------ schemas -------------// Define database schemas.
- |------------------------ transformers --------// Transform data before insert and after select from database.
- |------------------------ DbContext.ts
- |------------------------ ServiceRegister.ts
- |------------ logs
- |------------------ log -----------------------// Local log service.
- |------------ medias
- |------------------ storage -------------------// File storage service.
- |------------ messages
- |------------------ mail ----------------------// Mail service.
- |------------------ notification --------------// notification service.
- |------------------ sms -----------------------// Sms service.
- |------------ payments
- |------------------ payment -------------------// Payment service.
- |------------ InfrastructureModule.ts
- |------------ SingletonRegister.ts ------------// Define singleton and need to load first.
- |------ web.socket
- |------------ controllers ---------------------// Navigate for requests.
- |------------ SocketModule.ts
- |------------ SocketService.ts -----------------// Initialize socket service
- |------ app.ts --------------------------------// Main application.
- |------ ModuleRegister.ts
- |-- .dockerignore -----------------------------// Docker ignore configuration.
- |-- .env --------------------------------------// Configuration cloned from `.env.sample` and we need to add to `.gitignore`.
- |-- .env.sample -------------------------------// Configuration sample.
- |-- .eslintrc.js ------------------------------// Eslint configuration.
- |-- .gitignore --------------------------------// Git ignore configuration.
- |-- .nycrc ------------------------------------// Nyc configuration for testing coverage.
- |-- docker-compose.yml ------------------------// Docker configuration.
- |-- Dockerfile --------------------------------// Used by `docker-compose.yml`.
- |-- gruntfile.js
- |-- LICENSE
- |-- ormconfig.js ------------------------------// TypeORM configuration, this file only use for running migration commands.
- |-- package-lock.json -------------------------// Lock package version.
- |-- package.json
- |-- README.md ---------------------------------// `IMPORTANT` to start the project.
- |-- tsconfig.json -----------------------------// Typescript configuration.
```

### NPM Commands

```s
npm run cache:clear -------------------------------// Clear cache of TypeORM.
npm run migration:generate {Migration_Name} -------// Generate migration for update database structure.
npm run migration:run -----------------------------// Run the next migrations for update database structure.
npm run migration:revert --------------------------// Revert migration for update database structure.
npm run generate:module {ModuleName} --------------// Generate module: entity, dto, schema, repository, business, controller,...
npm run generate:claim ----------------------------// Generate new claim for defination.
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
./node_modules/.bin/grunt exec:generate_claim -------------// Generate new claim for defination.
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
- npm test (if have unit test)
- npm run migration:run
```

- Refer the deployment steps like below:
```
- apk add --update openssh # Use this command for Alpine Linux
- ssh $STAG_USER@$STAG_ADDR "cd $STAG_PROJECT_PATH && git pull && docker system prune -f && docker-compose build && docker-compose up -d && exit;"
```

### Generate Module

- This feature is very useful. It helps developers to reduce a part of development time.
- If you want to create module Customer, you can execute: `npm run generate:module Customer`. It will generate, model entity, schema, dtos, repository, business, controller, permission resource,....

### Configuration

- `.env` file is main configuration created by `.env.sample`.
- `.dockerignore` is Docker ignore configuration.
- `docker-compose.yml` is Docker configuration.
- `Dockerfile` is Docker script for build image.
- `.eslintrc.js` is Eslint configuration.
- `.gitignore` is Git ignore configuration.
- `.nycrc` is Nyc configuration for testing coverage.
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
- Currently we are caching role list and permission list. You can refer to function `getAll` of `RoleRepository` and `getAllByRole` of `PermissionRepository`.
- To clear cache, execute command `await this.dbContext.clearCaching('roles')`, we also use typeorm `typeorm cache:clear` or use npm `npm run cache:clear` for clearing all data caching.

### Authentication

- We are using `JWT` to authenticate user access for http request and socket io.
- Default we use the authencation signature with `HS256`.
- For each environment, you should change the secret key to another by `AUTH_SECRET_KEY` in `.env`.

### File Storage

- Default we don't want to store the file in the same server that we use to serve this project.
- We can use [Minio](https://github.com/felixle236/docker-minio) like AWS S3 to store the file go to cloud.
- We also switch to AWS S3 by change the configuration of environment `STORAGE_TYPE` in `.env`.
- Refer with values `MINIO (1) - AWS_S3 (2) - GOOGLE_STORAGE (3) - LOGGING (empty)`.

### Send Mail Template

- We are using `mailgen` package to generate the mail template. There are a lot of the mail template to use, refer to [mailgen](https://github.com/eladnava/mailgen).
- We can use Google SMTP or SendInBlue to send mail by change the configuration of environment `SEND_MAIL_TYPE` in `.env`. Also you can integrate another service that you want to use.
- Refer with values `GOOGLE_SMTP (1) - SEND_IN_BLUE (2) - LOGGING (empty)`.

### Common Type

- Define enum type into `src/constants/Enums.ts`. It can be a number or a string.
- When do we use the enum type in our project?
   > Define a serial of data in a column in the database that we can identify earlier. Ex: RoleId, OrderStatus, InvoiceStatus, AccountType,....

- Why do we use the enum type?
   > It will be easier to understand and maintain your source code. Please take a look and compare them: `if (order.status === OrderStatus.Draft)` vs `if (order.status === 1)`, `order.status = OrderStatus.processing` vs `order.status = 2`.

- The advice is that you should use a starting value of `1` if you are using the number data type. It will be easier to validate the data input. Ex: `if (!data.status) throw new SystemError(102, 'order status');`

### Error Handler

We should define message error into `src/constants/Messages.ts`. Ex:
```
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
```

Usage:
```
import { SystemError } from '../dtos/common/Exception';
....
throw new SystemError(); // Using default ERR_0001 => Data is invalid!
throw new SystemError(3); // ERR_0003 => Access is denied!
throw new SystemError(1001, 'id'); // ERR_1001 => The id is required!
throw new SystemError(2006, 'image', 'JPEG (.jpeg/.jpg), GIF (.gif), PNG (.png)'); // ERR_2006 => Invalid or unsupported image format! The following formats are supported: JPEG (.jpeg/.jpg), GIF (.gif), PNG (.png)
throw new SystemError(3001, 'password', 6, 20); // ERR_3001 => The password must be at least 6 and maximum 20 characters!
```

> If you got error with status code 500, it's error system. Almost, this error is your source code, you need to find and fix it soon.

### Data Transformer

- If you use column numeric type in PostgreSQL, it will return a string (not number), you should use transformer option to convert to number. Ex: `@Column('numeric', { transformer: new NumericTransformer() })`
- If you have a field `birthday` with data type is string and store into db with data type is Date. Ex: `@Column('date', { name: UserSchema.COLUMNS.BIRTHDAY, nullable: true, transformer: new DateTransformer() })`

### Database Execution

- Default TypeORM is using connection pool, it will auto connect and release connection when we execute database query except manual connect with QueryRunner, we must execute connect and release commands manually.
- We should use QueryBuilder for database execution, it will select and map to entity object.
- To use database transaction:
```
await getConnection().transaction(async entityManager => {
   const queryRunner = entityManager.connection.createQueryRunner();
   let user = await this.userRepository.getByEmail(item.email, queryRunner);
   ....
   const id = await this.userRepository.create(user, queryRunner);
   ....
});
```

### Database Migration

- Database Migrations, a technique to help us keep our database changes under control. Database migration is the process of transforming data between various states without any human interaction. This process will allow us to track changes between schema updates.

- In a production environment, where data is already in the DB, we may have to migrate those as well. Same cases apply to testing and staging environments but production is a more fragile universe where mistakes are not forgiven. Say we need to split the Name field of our Users table into a First/Last Name fields combination. One approach would be to create a field called Last Name. Traverse the table, split the Name into two chunks and move the latter to the newly created field. Finally, rename the Name field into First Name. This is a case of data migrations.

- To generate new migration:
```
npm run migration:generate Migration_Name
```
> Migration_Name should be named full meaning. Ex: Create_Table_Customer, Add_Field_Email_In_Customer, Modify_Field_Email_In_Customer, Migrate_Old_Data_To_New_Data,....

- To run the next migrations for update database structure:
```
npm run migration:run
```

- To revert back the previous migration:
```
npm run migration:revert
```

### Permission

- We are using the claim for checking permission, we shouldn't use the role, the role is just the master data, think about an extended case later.
- The claim is defined in `./src/constants/claims`, each claims number will unique with all other claims.
- We just validate and check permission in controllers and pass user info (user authenticated) into business functions (if necessary).
- Usually, we have 3 cases:
   - `Anonymous` (Non-user) to allow access API, we don't need to do anything about permission.
   - `Any user authenticated` to allow access API, just use `@Authorized()` without claim on controller functions.
   - `Any user authenticated and claim special` to allow access API, just use `@Authorized(UserClaim.UPDATE)` with claim on controller functions.
- `@Authorized()` is a decorator, it will check `authorization` header, if authenticate success then return `UserAuthenticated` object. Also, we can pass the claim in this function for checking. The process will be through the cache first, so the process will be handled very quickly.

- To check permission of the user in another place (ex: business and repository), we can use the information of `UserAuthenticated` and pass to filter data (or another param).

### API Response Format

- Return error object [UnauthorizedError] with status code 401, this is handler of routing-controllers package.
```
Request:
curl -i -H Accept:application/json -X GET http://localhost:3000/api/v1/me

Response:
HTTP/1.1 401 Unauthorized
{
   "code": 1010,
   "message": "The authorization token was not found!"
}
```

- Return error object [SystemError] with status code 400, this is logic handler.
```
Request:
curl -i -H Accept:application/json -X POST http://localhost:3000/api/v1/auth/signin -H Content-Type:application/json -d '{"email": "admin@localhost.com","password": "Nodecore@2"}'

Response:
HTTP/1.1 400 Bad Request
{
   "code": 1003,
   "message": "The email address or password is incorrect!",
}
```

- Return data object [UserSigninSucceedResponse] with status code 200.
```
Request:
curl -i -H Accept:application/json -X POST http://localhost:3000/api/v1/auth/signin -H Content-Type:application/json -d '{"email": "admin@localhost.com", "password": "Nodecore@2"}'

Response:
HTTP/1.1 200 OK
{
   "data": {
      "profile": {
         "id": 1,
         "createdAt": "2020-02-09T19:33:44.871Z",
         "updatedAt": "2020-02-10T02:08:38.631Z",
         "roleId": 1,
         "firstName": "Super",
         "lastName": "Admin",
         "fullName": "Super Admin",
         "email": "admin@localhost.com",
         "avatar": null,
         "gender": "male",
         "birthday": "1990-12-31",
         "phone": "0912345678",
         "address": "123 Abc",
         "culture": "en-US",
         "currency": "USD",
         "role": {
               "id": 1,
               "createdAt": "2020-02-09T19:33:44.871Z",
               "updatedAt": "2020-02-09T19:33:44.871Z",
               "name": "Super Admin",
               "level": 1
         }
      },
      "claims": [
         16085598,
         34040810,
         100024013,
         108823082,
         ....
      ],
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...;"
   }
}
```

- Return data object [ResultListResponse\<T\>] with status code 200.
```
Request:
curl -i -H Accept:application/json -H 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlSWQiOjEs...' -X GET http://localhost:3000/api/v1/roles

Response:
HTTP/1.1 200 OK
{
   "data": {
      "pagination": {
         "skip": 0,
         "limit": 10,
         "total": 2
      },
      "results": [
         {
            "id": 2,
            "createdAt": "2020-02-09T19:33:44.871Z",
            "updatedAt": "2020-02-09T19:33:44.871Z",
            "name": "Common User",
            "level": 2
         },
         {
            "id": 3,
            "createdAt": "2020-02-10T01:52:39.630Z",
            "updatedAt": "2020-02-10T01:52:55.348Z",
            "name": "Role Test",
            "level": 4
         }
      ]
   }
}
```

- Return data object [BulkActionResponse\<T\>] with status code 200.
```
Request:
curl -i -H Accept:application/json -H 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlSWQiOjEs...' -X POST http://localhost:3000/api/v1/systems/sample-data -H Content-Type:application/json

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
curl -i -H Accept:application/json -H 'Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlSWQiOjEs...' -X DELETE http://localhost:3000/api/v1/roles/3 -H Content-Type:application/json

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
GET http://localhost/api/v1/users/1                       --> Get user with id is 1 and return the user object.
GET http://localhost/api/v1/users/1/role                  --> Get role of user with id is 1 and return the role object.
```

- `POST`: Used to create new resource, add a child resource, upload file, requests the creation of an activation.

```
POST http://localhost/api/v1/auth/signin                   --> Signin request.
POST http://localhost/api/v1/auth/signup                   --> Register new user.
POST http://localhost/api/v1/auth/active                   --> Request active user.
POST http://localhost/api/v1/auth/resend-activation
POST http://localhost/api/v1/auth/forgot-password
POST http://localhost/api/v1/auth/resend-activation
POST http://localhost/api/v1/me/avatar                     --> Upload binary file.
POST http://localhost/api/v1/users                         --> Create user.
```

- `PUT`: Used to create new resource or update (replace object) if it already exists, replace the entire using the data specified in request.

```
PUT http://localhost/api/v1/users/1                       --> Update user object with id 1.
PUT http://localhost/api/v1/auth/reset-password           --> Reset/update password.
```

- `PATCH`: Used only to update some fields with record id. Besides, it's just about the meaning, sometime it's very difficult to recognize the boundary, we can use `PUT` instead of `PATCH`.

```
PATCH http://localhost/api/v1/me/password
```

- `DELETE`: Used to delete, remove item, disable, inactive,....

```
DELETE http://localhost/api/v1/users/1
```

### Experiences

- Order of development:
   - Web Core:
      - Model interface (src/web.core/interfaces/models)
      - Model (src/web.core/models)
      - Dtos (src/web.core/dtos)
         - Responses
         - Requests
      - Gateway interface (src/web.core/interfaces/gateways(/data))
      - Business interface (src/web.core/interfaces/businesses)
      - Business (src/web.core/businesses)
   - Web Infrastructure (data)
      - Schema (src/web.infrastructure/data/typeorm/schemas)
      - Entity (src/web.infrastructure/data/typeorm/entities)
      - Repository (src/web.infrastructure/data/typeorm/repositories)
   - Web API:
      - Controller (src/web.api/controllers)
   - Web Socket:
      - Controller (src/web.socket/controllers)
- API controllers order should be arranged in turn according to GET, POST, PUT, PATCH, DELETE.
- The function order should be arranged in turn according to find, findCommon, get, check, create, update, delete, remove.
- The query param will be a string value, if you want to get another type (boolean, number,...), you need to parse them with decorator like `@IsBoolean()`. Refer to UserFilterRequest.ts file.
