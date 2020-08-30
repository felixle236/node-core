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

const entityInterfacePath = path.join(__dirname, `../src/web.core/domain/types/I${pascalName}.ts`);
const entityInterface = getFileContent(path.join(__dirname, './web.core/domain/Type.tmp'));

const entityPath = path.join(__dirname, `../src/web.core/domain/entities/${pascalName}.ts`);
const entity = getFileContent(path.join(__dirname, './web.core/domain/Entity.tmp'));

const repositoryInterfacePath = path.join(__dirname, `../src/web.core/gateways/repositories/I${pascalName}Repository.ts`);
const repositoryInterface = getFileContent(path.join(__dirname, './web.core/gateways/IRepository.tmp'));

const findQueryInteractorPath = path.join(__dirname, `../src/web.core/interactors/${camelName}/queries/find-${camelName}/Find${pascalName}Query.ts`);
const findQueryInteractor = getFileContent(path.join(__dirname, './web.core/interactors/queries/find/FindQuery.tmp'));

const findQueryHandlerInteractorPath = path.join(__dirname, `../src/web.core/interactors/${camelName}/queries/find-${camelName}/Find${pascalName}QueryHandler.ts`);
const findQueryHandlerInteractor = getFileContent(path.join(__dirname, './web.core/interactors/queries/find/FindQueryHandler.tmp'));

const findResultInteractorPath = path.join(__dirname, `../src/web.core/interactors/${camelName}/queries/find-${camelName}/Find${pascalName}Result.ts`);
const findResultInteractor = getFileContent(path.join(__dirname, './web.core/interactors/queries/find/FindResult.tmp'));

const getByIdQueryInteractorPath = path.join(__dirname, `../src/web.core/interactors/${camelName}/queries/get-${camelName}-by-id/Get${pascalName}ByIdQuery.ts`);
const getByIdQueryInteractor = getFileContent(path.join(__dirname, './web.core/interactors/queries/get-by-id/GetByIdQuery.tmp'));

const getByIdQueryHandlerInteractorPath = path.join(__dirname, `../src/web.core/interactors/${camelName}/queries/get-${camelName}-by-id/Get${pascalName}ByIdQueryHandler.ts`);
const getByIdQueryHandlerInteractor = getFileContent(path.join(__dirname, './web.core/interactors/queries/get-by-id/GetByIdQueryHandler.tmp'));

const getByIdResultInteractorPath = path.join(__dirname, `../src/web.core/interactors/${camelName}/queries/get-${camelName}-by-id/Get${pascalName}ByIdResult.ts`);
const getByIdResultInteractor = getFileContent(path.join(__dirname, './web.core/interactors/queries/get-by-id/GetByIdResult.tmp'));

const createCommandInteractorPath = path.join(__dirname, `../src/web.core/interactors/${camelName}/commands/create-${camelName}/Create${pascalName}Command.ts`);
const createCommandInteractor = getFileContent(path.join(__dirname, './web.core/interactors/commands/create/CreateCommand.tmp'));

const createCommandHandlerInteractorPath = path.join(__dirname, `../src/web.core/interactors/${camelName}/commands/create-${camelName}/Create${pascalName}CommandHandler.ts`);
const createCommandHandlerInteractor = getFileContent(path.join(__dirname, './web.core/interactors/commands/create/CreateCommandHandler.tmp'));

const updateCommandInteractorPath = path.join(__dirname, `../src/web.core/interactors/${camelName}/commands/update-${camelName}/Update${pascalName}Command.ts`);
const updateCommandInteractor = getFileContent(path.join(__dirname, './web.core/interactors/commands/update/UpdateCommand.tmp'));

const updateCommandHandlerInteractorPath = path.join(__dirname, `../src/web.core/interactors/${camelName}/commands/update-${camelName}/Update${pascalName}CommandHandler.ts`);
const updateCommandHandlerInteractor = getFileContent(path.join(__dirname, './web.core/interactors/commands/update/UpdateCommandHandler.tmp'));

const deleteCommandInteractorPath = path.join(__dirname, `../src/web.core/interactors/${camelName}/commands/delete-${camelName}/Delete${pascalName}Command.ts`);
const deleteCommandInteractor = getFileContent(path.join(__dirname, './web.core/interactors/commands/delete/DeleteCommand.tmp'));

const deleteCommandHandlerInteractorPath = path.join(__dirname, `../src/web.core/interactors/${camelName}/commands/delete-${camelName}/Delete${pascalName}CommandHandler.ts`);
const deleteCommandHandlerInteractor = getFileContent(path.join(__dirname, './web.core/interactors/commands/delete/DeleteCommandHandler.tmp'));

// web.infrastructure

const schemaPath = path.join(__dirname, `../src/web.infrastructure/databases/typeorm/schemas/${pascalName}Schema.ts`);
const schema = getFileContent(path.join(__dirname, './web.infrastructure/databases/Schema.tmp'));

const entityDbPath = path.join(__dirname, `../src/web.infrastructure/databases/typeorm/entities/${pascalName}Db.ts`);
const entityDb = getFileContent(path.join(__dirname, './web.infrastructure/databases/EntityDb.tmp'));

const repositoryPath = path.join(__dirname, `../src/web.infrastructure/databases/typeorm/repositories/${pascalName}Repository.ts`);
const repository = getFileContent(path.join(__dirname, './web.infrastructure/databases/Repository.tmp'));

// web.api

const controllerPath = path.join(__dirname, `../src/web.api/controllers/${pascalName}Controller.ts`);
const controller = getFileContent(path.join(__dirname, './web.api/Controller.tmp'));

// Handle

createDirectories(
    entityInterfacePath,
    entityPath,
    repositoryInterfacePath,
    findQueryInteractorPath,
    findQueryHandlerInteractorPath,
    findResultInteractorPath,
    getByIdQueryInteractorPath,
    getByIdQueryHandlerInteractorPath,
    getByIdResultInteractorPath,
    createCommandInteractorPath,
    createCommandHandlerInteractorPath,
    updateCommandInteractorPath,
    updateCommandHandlerInteractorPath,
    deleteCommandInteractorPath,
    deleteCommandHandlerInteractorPath,
    schemaPath,
    entityDbPath,
    repositoryPath,
    controllerPath
);

fs.writeFileSync(entityInterfacePath, entityInterface);
fs.writeFileSync(entityPath, entity);
fs.writeFileSync(repositoryInterfacePath, repositoryInterface);
fs.writeFileSync(findQueryInteractorPath, findQueryInteractor);
fs.writeFileSync(findQueryHandlerInteractorPath, findQueryHandlerInteractor);
fs.writeFileSync(findResultInteractorPath, findResultInteractor);
fs.writeFileSync(getByIdQueryInteractorPath, getByIdQueryInteractor);
fs.writeFileSync(getByIdQueryHandlerInteractorPath, getByIdQueryHandlerInteractor);
fs.writeFileSync(getByIdResultInteractorPath, getByIdResultInteractor);
fs.writeFileSync(createCommandInteractorPath, createCommandInteractor);
fs.writeFileSync(createCommandHandlerInteractorPath, createCommandHandlerInteractor);
fs.writeFileSync(updateCommandInteractorPath, updateCommandInteractor);
fs.writeFileSync(updateCommandHandlerInteractorPath, updateCommandHandlerInteractor);
fs.writeFileSync(deleteCommandInteractorPath, deleteCommandInteractor);
fs.writeFileSync(deleteCommandHandlerInteractorPath, deleteCommandHandlerInteractor);
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
        .replace(new RegExp('{camelName}', 'g'), camelName)
        .replace(new RegExp('{PascalName}', 'g'), pascalName)
        .replace(new RegExp('{UPPER_CASE_NAME}', 'g'), upperCaseName);
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
