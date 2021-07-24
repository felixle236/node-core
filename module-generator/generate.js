/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

let moduleName = process.argv.length > 2 && process.argv[2].trim();
if (!moduleName)
    throw new Error('Missing name of the module!');

let folder = moduleName;
if (moduleName.includes('#')) {
    folder = moduleName.split('#')[0];
    moduleName = moduleName.split('#')[1];

    if (!folder || !moduleName)
        throw new Error('Missing name of the module or sub module!');
    if (folder === moduleName)
        throw new Error('The name of module cannot match sub module!');

    console.log('Module:\x1b[32m', folder, '\x1b[0m');
    console.log('Sub-Module:\x1b[32m', moduleName, '\x1b[0m');
}
else
    console.log('Module:\x1b[32m', moduleName, '\x1b[0m');

folder = convertToDirectoryName(folder);
const usecaseFncFolder = convertToDirectoryName(moduleName);
const camelName = moduleName.substr(0, 1).toLowerCase() + moduleName.substr(1);
const pascalName = moduleName.substr(0, 1).toUpperCase() + moduleName.substr(1);
const upperCaseName = convertToDirectoryName(moduleName).replace(/-/g, '_').toUpperCase();
const lowerCaseName = upperCaseName.toLowerCase();

// core

const entityInterfacePath = path.join(__dirname, `../src/core/domain/types/${folder}/I${pascalName}.ts`);
const entityInterface = getFileContent(path.join(__dirname, './core/domain/Type.tmp'));

const entityPath = path.join(__dirname, `../src/core/domain/entities/${folder}/${pascalName}.ts`);
const entity = getFileContent(path.join(__dirname, './core/domain/Entity.tmp'));

const repositoryInterfacePath = path.join(__dirname, `../src/core/gateways/repositories/${folder}/I${pascalName}Repository.ts`);
const repositoryInterface = getFileContent(path.join(__dirname, './core/gateways/IRepository.tmp'));

const findQueryUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/queries/find-${usecaseFncFolder}/Find${pascalName}Query.ts`);
const findQueryUsecase = getFileContent(path.join(__dirname, './core/usecases/queries/find/FindQuery.tmp'));

const findQueryHandlerUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/queries/find-${usecaseFncFolder}/Find${pascalName}QueryHandler.ts`);
const findQueryHandlerUsecase = getFileContent(path.join(__dirname, './core/usecases/queries/find/FindQueryHandler.tmp'));

const findQueryResultUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/queries/find-${usecaseFncFolder}/Find${pascalName}QueryResult.ts`);
const findQueryResultUsecase = getFileContent(path.join(__dirname, './core/usecases/queries/find/FindQueryResult.tmp'));

const getByIdQueryUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/queries/get-${usecaseFncFolder}-by-id/Get${pascalName}ByIdQuery.ts`);
const getByIdQueryUsecase = getFileContent(path.join(__dirname, './core/usecases/queries/get-by-id/GetByIdQuery.tmp'));

const getByIdQueryHandlerUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/queries/get-${usecaseFncFolder}-by-id/Get${pascalName}ByIdQueryHandler.ts`);
const getByIdQueryHandlerUsecase = getFileContent(path.join(__dirname, './core/usecases/queries/get-by-id/GetByIdQueryHandler.tmp'));

const getByIdQueryResultUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/queries/get-${usecaseFncFolder}-by-id/Get${pascalName}ByIdQueryResult.ts`);
const getByIdQueryResultUsecase = getFileContent(path.join(__dirname, './core/usecases/queries/get-by-id/GetByIdQueryResult.tmp'));

const createCommandUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/commands/create-${usecaseFncFolder}/Create${pascalName}Command.ts`);
const createCommandUsecase = getFileContent(path.join(__dirname, './core/usecases/commands/create/CreateCommand.tmp'));

const createCommandHandlerUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/commands/create-${usecaseFncFolder}/Create${pascalName}CommandHandler.ts`);
const createCommandHandlerUsecase = getFileContent(path.join(__dirname, './core/usecases/commands/create/CreateCommandHandler.tmp'));

const updateCommandUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/commands/update-${usecaseFncFolder}/Update${pascalName}Command.ts`);
const updateCommandUsecase = getFileContent(path.join(__dirname, './core/usecases/commands/update/UpdateCommand.tmp'));

const updateCommandHandlerUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/commands/update-${usecaseFncFolder}/Update${pascalName}CommandHandler.ts`);
const updateCommandHandlerUsecase = getFileContent(path.join(__dirname, './core/usecases/commands/update/UpdateCommandHandler.tmp'));

const deleteCommandUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/commands/delete-${usecaseFncFolder}/Delete${pascalName}Command.ts`);
const deleteCommandUsecase = getFileContent(path.join(__dirname, './core/usecases/commands/delete/DeleteCommand.tmp'));

const deleteCommandHandlerUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/commands/delete-${usecaseFncFolder}/Delete${pascalName}CommandHandler.ts`);
const deleteCommandHandlerUsecase = getFileContent(path.join(__dirname, './core/usecases/commands/delete/DeleteCommandHandler.tmp'));

// infrastructure

const schemaPath = path.join(__dirname, `../src/infras/data/typeorm/schemas/${folder}/${pascalName}Schema.ts`);
const schema = getFileContent(path.join(__dirname, './infras/data/Schema.tmp'));

const entityDbPath = path.join(__dirname, `../src/infras/data/typeorm/entities/${folder}/${pascalName}Db.ts`);
const entityDb = getFileContent(path.join(__dirname, './infras/data/EntityDb.tmp'));

const repositoryPath = path.join(__dirname, `../src/infras/data/typeorm/repositories/${folder}/${pascalName}Repository.ts`);
const repository = getFileContent(path.join(__dirname, './infras/data/Repository.tmp'));

// web.api

const controllerPath = path.join(__dirname, `../src/infras/web.api/controllers/${folder}/${pascalName}Controller.ts`);
const controller = getFileContent(path.join(__dirname, './infras/web.api/Controller.tmp'));

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

console.log('\n\x1b[32mGenerate module "' + moduleName + '" successfully.\x1b[0m\n');

/**
 * Get content of special file
 * @param {string} path Generate source code to directory
 */
function getFileContent(path) {
    return fs.readFileSync(path, 'utf8')
        .replace(/{folder}/g, folder)
        .replace(/{usecaseFncFolder}/g, usecaseFncFolder)
        .replace(/{camelName}/g, camelName)
        .replace(/{PascalName}/g, pascalName)
        .replace(/{UPPER_CASE_NAME}/g, upperCaseName)
        .replace(/{lower_case_name}/g, lowerCaseName);
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

/**
 * Convert directory name
 * @param {string} directoryName directory name
 */
function convertToDirectoryName(directoryName) {
    let match;
    while ((match = /[A-Z]/g.exec(directoryName)) != null) {
        if (match.index === 0)
            directoryName = directoryName[match.index].toLowerCase() + directoryName.substr(match.index + 1);
        else
            directoryName = directoryName.substr(0, match.index) + '-' + directoryName[match.index].toLowerCase() + directoryName.substr(match.index + 1);
    }
    return directoryName;
}
