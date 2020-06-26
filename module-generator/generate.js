const fs = require('fs');
const path = require('path');
const moduleName = process.argv.length > 2 && process.argv[2].trim();

if (!moduleName) {
    console.error('\x1b[35mMissing name of the module!\n\x1b[0m');
    return;
}

const camelName = moduleName.substr(0, 1).toLowerCase() + moduleName.substr(1);
const pascalName = moduleName.substr(0, 1).toUpperCase() + moduleName.substr(1);

// web.core

const modelInterfacePath = path.join(__dirname, `./src/web.core/interfaces/models/I${pascalName}.ts`);
const modelInterface = getFileContent(path.join(__dirname, './web.core/interfaces/IModel.tmp'), camelName, pascalName);

const modelPath = path.join(__dirname, `./src/web.core/models/${pascalName}.ts`);
const model = getFileContent(path.join(__dirname, './web.core/Model.tmp'), camelName, pascalName);

const dtoDirPath = path.join(__dirname, `./src/web.core/dtos/${camelName}`);
const dtoRequestDirPath = path.join(__dirname, `./src/web.core/dtos/${camelName}/requests`);
const dtoResponseDirPath = path.join(__dirname, `./src/web.core/dtos/${camelName}/responses`);

const dtoResponsePath = path.join(__dirname, `./src/web.core/dtos/${camelName}/responses/${pascalName}Response.ts`);
const dtoResponse = getFileContent(path.join(__dirname, './web.core/dtos/responses/Response.tmp'), camelName, pascalName);

const dtoFilterRequestPath = path.join(__dirname, `./src/web.core/dtos/${camelName}/requests/${pascalName}FilterRequest.ts`);
const dtoFilterRequest = getFileContent(path.join(__dirname, './web.core/dtos/requests/FilterRequest.tmp'), camelName, pascalName);

const dtoCreateRequestPath = path.join(__dirname, `./src/web.core/dtos/${camelName}/requests/${pascalName}CreateRequest.ts`);
const dtoCreateRequest = getFileContent(path.join(__dirname, './web.core/dtos/requests/CreateRequest.tmp'), camelName, pascalName);

const dtoUpdateRequestPath = path.join(__dirname, `./src/web.core/dtos/${camelName}/requests/${pascalName}UpdateRequest.ts`);
const dtoUpdateRequest = getFileContent(path.join(__dirname, './web.core/dtos/requests/UpdateRequest.tmp'), camelName, pascalName);

const repositoryInterfacePath = path.join(__dirname, `./src/web.core/interfaces/gateways/data/I${pascalName}Repository.ts`);
const repositoryInterface = getFileContent(path.join(__dirname, './web.core/interfaces/IRepository.tmp'), camelName, pascalName);

const businessInterfacePath = path.join(__dirname, `./src/web.core/interfaces/businesses/I${pascalName}Business.ts`);
const businessInterface = getFileContent(path.join(__dirname, './web.core/interfaces/IBusiness.tmp'), camelName, pascalName);

const businessPath = path.join(__dirname, `./src/web.core/businesses/${pascalName}Business.ts`);
const business = getFileContent(path.join(__dirname, './web.core/Business.tmp'), camelName, pascalName);

fs.writeFileSync(modelInterfacePath, modelInterface);
fs.writeFileSync(modelPath, model);

if (!fs.existsSync(dtoDirPath))
    fs.mkdirSync(dtoDirPath);
if (!fs.existsSync(dtoRequestDirPath))
    fs.mkdirSync(dtoRequestDirPath);
if (!fs.existsSync(dtoResponseDirPath))
    fs.mkdirSync(dtoResponseDirPath);

fs.writeFileSync(dtoResponsePath, dtoResponse);
fs.writeFileSync(dtoFilterRequestPath, dtoFilterRequest);
fs.writeFileSync(dtoCreateRequestPath, dtoCreateRequest);
fs.writeFileSync(dtoUpdateRequestPath, dtoUpdateRequest);

fs.writeFileSync(repositoryInterfacePath, repositoryInterface);
fs.writeFileSync(businessInterfacePath, businessInterface);
fs.writeFileSync(businessPath, business);

// web.infrastructure

const schemaPath = path.join(__dirname, `./src/web.infrastructure/data/typeorm/schemas/${pascalName}Schema.ts`);
const schema = getFileContent(path.join(__dirname, './web.infrastructure/data/Schema.tmp'), camelName, pascalName);

const entityPath = path.join(__dirname, `./src/web.infrastructure/data/typeorm/entities/${pascalName}Entity.ts`);
const entity = getFileContent(path.join(__dirname, './web.infrastructure/data/Entity.tmp'), camelName, pascalName);

const repositoryPath = path.join(__dirname, `./src/web.infrastructure/data/typeorm/repositories/${pascalName}Repository.ts`);
const repository = getFileContent(path.join(__dirname, './web.infrastructure/data/Repository.tmp'), camelName, pascalName);

fs.writeFileSync(schemaPath, schema);
fs.writeFileSync(entityPath, entity);
fs.writeFileSync(repositoryPath, repository);

// web.api

const controllerPath = path.join(__dirname, `./src/web.api/controllers/${pascalName}Controller.ts`);
const controller = getFileContent(path.join(__dirname, './web.api/Controller.tmp'), camelName, pascalName);

fs.writeFileSync(controllerPath, controller);

// Claim

const claimPath = path.join(__dirname, `./src/constants/claims/${pascalName}Claim.ts`);
let claim = getFileContent(path.join(__dirname, './Claim.tmp'), camelName, pascalName);

while (claim.indexOf('{value}') !== -1) claim = claim.replace('{value}', Math.floor(Math.random() * 100000000 * 6).toString());
fs.writeFileSync(claimPath, claim);

/**
 * Get content of special file
 * @param {string} path Generate source code to directory
 * @param {string} camelName The module name with camel style
 * @param {string} pascalName The module name with pascal style
 */
function getFileContent(path, camelName, pascalName) {
    return fs.readFileSync(path, 'utf8').replace(new RegExp('{camelName}', 'g'), camelName).replace(new RegExp('{PascalName}', 'g'), pascalName);
}