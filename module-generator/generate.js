const fs = require('fs');
const path = require('path');

const moduleName = process.argv.length > 2 && process.argv[2].trim();
if (!moduleName) {
    console.error('\x1b[35mMissing name of the module!\n\x1b[0m');
    return;
}

const camelName = moduleName.substr(0, 1).toLowerCase() + moduleName.substr(1);
const pascalName = moduleName.substr(0, 1).toUpperCase() + moduleName.substr(1);
const upperCaseName = moduleName.toUpperCase();

// web.core

const entityInterfacePath = path.join(__dirname, `../src/web.core/domain/types/${camelName}/I${pascalName}.ts`);
const entityInterface = getFileContent(path.join(__dirname, './web.core/domain/Type.tmp'));

const entityPath = path.join(__dirname, `../src/web.core/domain/entities/${camelName}/${pascalName}.ts`);
const entity = getFileContent(path.join(__dirname, './web.core/domain/Entity.tmp'));

const repositoryInterfacePath = path.join(__dirname, `../src/web.core/gateways/repositories/${camelName}/I${pascalName}Repository.ts`);
const repositoryInterface = getFileContent(path.join(__dirname, './web.core/gateways/IRepository.tmp'));

const findQueryUsecasePath = path.join(__dirname, `../src/web.core/usecases/${camelName}/queries/find-${camelName}/Find${pascalName}Query.ts`);
const findQueryUsecase = getFileContent(path.join(__dirname, './web.core/usecases/queries/find/FindQuery.tmp'));

const findQueryHandlerUsecasePath = path.join(__dirname, `../src/web.core/usecases/${camelName}/queries/find-${camelName}/Find${pascalName}QueryHandler.ts`);
const findQueryHandlerUsecase = getFileContent(path.join(__dirname, './web.core/usecases/queries/find/FindQueryHandler.tmp'));

const findQueryResultUsecasePath = path.join(__dirname, `../src/web.core/usecases/${camelName}/queries/find-${camelName}/Find${pascalName}QueryResult.ts`);
const findQueryResultUsecase = getFileContent(path.join(__dirname, './web.core/usecases/queries/find/FindQueryResult.tmp'));

const getByIdQueryUsecasePath = path.join(__dirname, `../src/web.core/usecases/${camelName}/queries/get-${camelName}-by-id/Get${pascalName}ByIdQuery.ts`);
const getByIdQueryUsecase = getFileContent(path.join(__dirname, './web.core/usecases/queries/get-by-id/GetByIdQuery.tmp'));

const getByIdQueryHandlerUsecasePath = path.join(__dirname, `../src/web.core/usecases/${camelName}/queries/get-${camelName}-by-id/Get${pascalName}ByIdQueryHandler.ts`);
const getByIdQueryHandlerUsecase = getFileContent(path.join(__dirname, './web.core/usecases/queries/get-by-id/GetByIdQueryHandler.tmp'));

const getByIdQueryResultUsecasePath = path.join(__dirname, `../src/web.core/usecases/${camelName}/queries/get-${camelName}-by-id/Get${pascalName}ByIdQueryResult.ts`);
const getByIdQueryResultUsecase = getFileContent(path.join(__dirname, './web.core/usecases/queries/get-by-id/GetByIdQueryResult.tmp'));

const createCommandUsecasePath = path.join(__dirname, `../src/web.core/usecases/${camelName}/commands/create-${camelName}/Create${pascalName}Command.ts`);
const createCommandUsecase = getFileContent(path.join(__dirname, './web.core/usecases/commands/create/CreateCommand.tmp'));

const createCommandHandlerUsecasePath = path.join(__dirname, `../src/web.core/usecases/${camelName}/commands/create-${camelName}/Create${pascalName}CommandHandler.ts`);
const createCommandHandlerUsecase = getFileContent(path.join(__dirname, './web.core/usecases/commands/create/CreateCommandHandler.tmp'));

const updateCommandUsecasePath = path.join(__dirname, `../src/web.core/usecases/${camelName}/commands/update-${camelName}/Update${pascalName}Command.ts`);
const updateCommandUsecase = getFileContent(path.join(__dirname, './web.core/usecases/commands/update/UpdateCommand.tmp'));

const updateCommandHandlerUsecasePath = path.join(__dirname, `../src/web.core/usecases/${camelName}/commands/update-${camelName}/Update${pascalName}CommandHandler.ts`);
const updateCommandHandlerUsecase = getFileContent(path.join(__dirname, './web.core/usecases/commands/update/UpdateCommandHandler.tmp'));

const deleteCommandUsecasePath = path.join(__dirname, `../src/web.core/usecases/${camelName}/commands/delete-${camelName}/Delete${pascalName}Command.ts`);
const deleteCommandUsecase = getFileContent(path.join(__dirname, './web.core/usecases/commands/delete/DeleteCommand.tmp'));

const deleteCommandHandlerUsecasePath = path.join(__dirname, `../src/web.core/usecases/${camelName}/commands/delete-${camelName}/Delete${pascalName}CommandHandler.ts`);
const deleteCommandHandlerUsecase = getFileContent(path.join(__dirname, './web.core/usecases/commands/delete/DeleteCommandHandler.tmp'));

// web.infrastructure

const schemaPath = path.join(__dirname, `../src/web.infrastructure/databases/typeorm/schemas/${camelName}/${pascalName}Schema.ts`);
const schema = getFileContent(path.join(__dirname, './web.infrastructure/databases/Schema.tmp'));

const entityDbPath = path.join(__dirname, `../src/web.infrastructure/databases/typeorm/entities/${camelName}/${pascalName}Db.ts`);
const entityDb = getFileContent(path.join(__dirname, './web.infrastructure/databases/EntityDb.tmp'));

const repositoryPath = path.join(__dirname, `../src/web.infrastructure/databases/typeorm/repositories/${camelName}/${pascalName}Repository.ts`);
const repository = getFileContent(path.join(__dirname, './web.infrastructure/databases/Repository.tmp'));

// web.api

const controllerPath = path.join(__dirname, `../src/web.api/controllers/${camelName}/${pascalName}Controller.ts`);
const controller = getFileContent(path.join(__dirname, './web.api/Controller.tmp'));

// Handle

createDirectories(
    entityInterfacePath,
    entityPath,
    repositoryInterfacePath,
    findQueryUsecasePath,
    findQueryHandlerUsecasePath,
    findQueryResultUsecasePath,
    getByIdQueryUsecasePath,
    getByIdQueryHandlerUsecasePath,
    getByIdQueryResultUsecasePath,
    createCommandUsecasePath,
    createCommandHandlerUsecasePath,
    updateCommandUsecasePath,
    updateCommandHandlerUsecasePath,
    deleteCommandUsecasePath,
    deleteCommandHandlerUsecasePath,
    schemaPath,
    entityDbPath,
    repositoryPath,
    controllerPath
);

fs.writeFileSync(entityInterfacePath, entityInterface);
fs.writeFileSync(entityPath, entity);
fs.writeFileSync(repositoryInterfacePath, repositoryInterface);
fs.writeFileSync(findQueryUsecasePath, findQueryUsecase);
fs.writeFileSync(findQueryHandlerUsecasePath, findQueryHandlerUsecase);
fs.writeFileSync(findQueryResultUsecasePath, findQueryResultUsecase);
fs.writeFileSync(getByIdQueryUsecasePath, getByIdQueryUsecase);
fs.writeFileSync(getByIdQueryHandlerUsecasePath, getByIdQueryHandlerUsecase);
fs.writeFileSync(getByIdQueryResultUsecasePath, getByIdQueryResultUsecase);
fs.writeFileSync(createCommandUsecasePath, createCommandUsecase);
fs.writeFileSync(createCommandHandlerUsecasePath, createCommandHandlerUsecase);
fs.writeFileSync(updateCommandUsecasePath, updateCommandUsecase);
fs.writeFileSync(updateCommandHandlerUsecasePath, updateCommandHandlerUsecase);
fs.writeFileSync(deleteCommandUsecasePath, deleteCommandUsecase);
fs.writeFileSync(deleteCommandHandlerUsecasePath, deleteCommandHandlerUsecase);
fs.writeFileSync(schemaPath, schema);
fs.writeFileSync(entityDbPath, entityDb);
fs.writeFileSync(repositoryPath, repository);
fs.writeFileSync(controllerPath, controller);

/**
 * Get content of special file
 * @param {string} path Generate source code to directory
 */
function getFileContent(path) {
    return fs.readFileSync(path, 'utf8')
        .replace(/{camelName}/g, camelName)
        .replace(/{PascalName}/g, pascalName)
        .replace(/{UPPER_CASE_NAME}/g, upperCaseName);
}

/**
 * Create directories if they are not exist
 * @param {string[]} directories list directory
 */
function createDirectories(...files) {
    for (let i = 0; i < files.length; i++) {
        const directory = path.dirname(files[i]);
        if (!fs.existsSync(directory))
            fs.mkdirSync(directory, { recursive: true });
    }
}
