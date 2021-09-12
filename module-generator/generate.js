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
const subFolder = convertToDirectoryName(moduleName);
let moduleNameText = convertToDirectoryName(moduleName).replace(/-/g, ' ').toLowerCase();
moduleNameText = moduleNameText.substr(0, 1).toUpperCase() + moduleNameText.substr(1);
const moduleNameTextLowerCase = moduleNameText.toLowerCase();
const camelName = moduleName.substr(0, 1).toLowerCase() + moduleName.substr(1);
const pascalName = moduleName.substr(0, 1).toUpperCase() + moduleName.substr(1);
const upperCaseName = convertToDirectoryName(moduleName).replace(/-/g, '_').toUpperCase();
const lowerCaseName = upperCaseName.toLowerCase();

// core

const entityInterfacePath = path.join(__dirname, `../src/core/domain/interfaces/${folder}/I${pascalName}.ts`);
const entityInterface = getFileContent(path.join(__dirname, './core/domain/Interface.tmp'));

const entitySpecPath = path.join(__dirname, `../src/core/domain/entities/${folder}/${pascalName}.spec.ts`);
const entitySpec = getFileContent(path.join(__dirname, './core/domain/Entity.spec.tmp'));

const entityPath = path.join(__dirname, `../src/core/domain/entities/${folder}/${pascalName}.ts`);
const entity = getFileContent(path.join(__dirname, './core/domain/Entity.tmp'));

const repositoryInterfacePath = path.join(__dirname, `../src/core/gateways/repositories/${folder}/I${pascalName}Repository.ts`);
const repositoryInterface = getFileContent(path.join(__dirname, './core/gateways/IRepository.tmp'));

const findQueryHandlerUsecaseSpecPath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/queries/find-${subFolder}/Find${pascalName}QueryHandler.spec.ts`);
const findQueryHandlerUsecaseSpec = getFileContent(path.join(__dirname, './core/usecases/queries/find/FindQueryHandler.spec.tmp'));

const findQueryHandlerUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/queries/find-${subFolder}/Find${pascalName}QueryHandler.ts`);
const findQueryHandlerUsecase = getFileContent(path.join(__dirname, './core/usecases/queries/find/FindQueryHandler.tmp'));

const findQueryInputUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/queries/find-${subFolder}/Find${pascalName}QueryInput.ts`);
const findQueryInputUsecase = getFileContent(path.join(__dirname, './core/usecases/queries/find/FindQueryInput.tmp'));

const findQueryOutputUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/queries/find-${subFolder}/Find${pascalName}QueryOutput.ts`);
const findQueryOutputUsecase = getFileContent(path.join(__dirname, './core/usecases/queries/find/FindQueryOutput.tmp'));

const getByIdQueryHandlerUsecaseSpecPath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/queries/get-${subFolder}-by-id/Get${pascalName}ByIdQueryHandler.spec.ts`);
const getByIdQueryHandlerUsecaseSpec = getFileContent(path.join(__dirname, './core/usecases/queries/get-by-id/GetByIdQueryHandler.spec.tmp'));

const getByIdQueryHandlerUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/queries/get-${subFolder}-by-id/Get${pascalName}ByIdQueryHandler.ts`);
const getByIdQueryHandlerUsecase = getFileContent(path.join(__dirname, './core/usecases/queries/get-by-id/GetByIdQueryHandler.tmp'));

const getByIdQueryOutputUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/queries/get-${subFolder}-by-id/Get${pascalName}ByIdQueryOutput.ts`);
const getByIdQueryOutputUsecase = getFileContent(path.join(__dirname, './core/usecases/queries/get-by-id/GetByIdQueryOutput.tmp'));

const createCommandHandlerUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/commands/create-${subFolder}/Create${pascalName}CommandHandler.ts`);
const createCommandHandlerUsecase = getFileContent(path.join(__dirname, './core/usecases/commands/create/CreateCommandHandler.tmp'));

const createCommandHandlerUsecaseSpecPath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/commands/create-${subFolder}/Create${pascalName}CommandHandler.spec.ts`);
const createCommandHandlerUsecaseSpec = getFileContent(path.join(__dirname, './core/usecases/commands/create/CreateCommandHandler.spec.tmp'));

const createCommandInputUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/commands/create-${subFolder}/Create${pascalName}CommandInput.ts`);
const createCommandInputUsecase = getFileContent(path.join(__dirname, './core/usecases/commands/create/CreateCommandInput.tmp'));

const createCommandOutputUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/commands/create-${subFolder}/Create${pascalName}CommandOutput.ts`);
const createCommandOutputUsecase = getFileContent(path.join(__dirname, './core/usecases/commands/create/CreateCommandOutput.tmp'));

const updateCommandHandlerUsecaseSpecPath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/commands/update-${subFolder}/Update${pascalName}CommandHandler.spec.ts`);
const updateCommandHandlerUsecaseSpec = getFileContent(path.join(__dirname, './core/usecases/commands/update/UpdateCommandHandler.spec.tmp'));

const updateCommandHandlerUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/commands/update-${subFolder}/Update${pascalName}CommandHandler.ts`);
const updateCommandHandlerUsecase = getFileContent(path.join(__dirname, './core/usecases/commands/update/UpdateCommandHandler.tmp'));

const updateCommandInputUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/commands/update-${subFolder}/Update${pascalName}CommandInput.ts`);
const updateCommandInputUsecase = getFileContent(path.join(__dirname, './core/usecases/commands/update/UpdateCommandInput.tmp'));

const updateCommandOutputUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/commands/update-${subFolder}/Update${pascalName}CommandOutput.ts`);
const updateCommandOutputUsecase = getFileContent(path.join(__dirname, './core/usecases/commands/update/UpdateCommandOutput.tmp'));

const deleteCommandHandlerUsecaseSpecPath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/commands/delete-${subFolder}/Delete${pascalName}CommandHandler.spec.ts`);
const deleteCommandHandlerUsecaseSpec = getFileContent(path.join(__dirname, './core/usecases/commands/delete/DeleteCommandHandler.spec.tmp'));

const deleteCommandHandlerUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/commands/delete-${subFolder}/Delete${pascalName}CommandHandler.ts`);
const deleteCommandHandlerUsecase = getFileContent(path.join(__dirname, './core/usecases/commands/delete/DeleteCommandHandler.tmp'));

const deleteCommandOutputUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/commands/delete-${subFolder}/Delete${pascalName}CommandOutput.ts`);
const deleteCommandOutputUsecase = getFileContent(path.join(__dirname, './core/usecases/commands/delete/DeleteCommandOutput.tmp'));

// infrastructure

const schemaPath = path.join(__dirname, `../src/infras/data/typeorm/schemas/${folder}/${pascalName}Schema.ts`);
const schema = getFileContent(path.join(__dirname, './infras/data/Schema.tmp'));

const entityDbPath = path.join(__dirname, `../src/infras/data/typeorm/entities/${folder}/${pascalName}Db.ts`);
const entityDb = getFileContent(path.join(__dirname, './infras/data/EntityDb.tmp'));

const repositorySpecPath = path.join(__dirname, `../src/infras/data/typeorm/repositories/${folder}/${pascalName}Repository.spec.ts`);
const repositorySpec = getFileContent(path.join(__dirname, './infras/data/Repository.spec.tmp'));

const repositoryPath = path.join(__dirname, `../src/infras/data/typeorm/repositories/${folder}/${pascalName}Repository.ts`);
const repository = getFileContent(path.join(__dirname, './infras/data/Repository.tmp'));

// api

const controllerSpecPath = path.join(__dirname, `../src/infras/api/controllers/${folder}/${pascalName}Controller.spec.ts`);
const controllerSpec = getFileContent(path.join(__dirname, './infras/api/Controller.spec.tmp'));

const controllerPath = path.join(__dirname, `../src/infras/api/controllers/${folder}/${pascalName}Controller.ts`);
const controller = getFileContent(path.join(__dirname, './infras/api/Controller.tmp'));

// Handle

createDirectories(
    entityInterfacePath,
    entityPath,
    repositoryInterfacePath,
    findQueryHandlerUsecasePath,
    getByIdQueryHandlerUsecasePath,
    createCommandHandlerUsecasePath,
    updateCommandHandlerUsecasePath,
    deleteCommandHandlerUsecasePath,
    schemaPath,
    entityDbPath,
    repositoryPath,
    controllerPath
);

fs.writeFileSync(entityInterfacePath, entityInterface);
fs.writeFileSync(entitySpecPath, entitySpec);
fs.writeFileSync(entityPath, entity);
fs.writeFileSync(repositoryInterfacePath, repositoryInterface);
fs.writeFileSync(findQueryHandlerUsecaseSpecPath, findQueryHandlerUsecaseSpec);
fs.writeFileSync(findQueryHandlerUsecasePath, findQueryHandlerUsecase);
fs.writeFileSync(findQueryInputUsecasePath, findQueryInputUsecase);
fs.writeFileSync(findQueryOutputUsecasePath, findQueryOutputUsecase);
fs.writeFileSync(getByIdQueryHandlerUsecaseSpecPath, getByIdQueryHandlerUsecaseSpec);
fs.writeFileSync(getByIdQueryHandlerUsecasePath, getByIdQueryHandlerUsecase);
fs.writeFileSync(getByIdQueryOutputUsecasePath, getByIdQueryOutputUsecase);
fs.writeFileSync(createCommandHandlerUsecaseSpecPath, createCommandHandlerUsecaseSpec);
fs.writeFileSync(createCommandHandlerUsecasePath, createCommandHandlerUsecase);
fs.writeFileSync(createCommandInputUsecasePath, createCommandInputUsecase);
fs.writeFileSync(createCommandOutputUsecasePath, createCommandOutputUsecase);
fs.writeFileSync(updateCommandHandlerUsecaseSpecPath, updateCommandHandlerUsecaseSpec);
fs.writeFileSync(updateCommandHandlerUsecasePath, updateCommandHandlerUsecase);
fs.writeFileSync(updateCommandInputUsecasePath, updateCommandInputUsecase);
fs.writeFileSync(updateCommandOutputUsecasePath, updateCommandOutputUsecase);
fs.writeFileSync(deleteCommandHandlerUsecaseSpecPath, deleteCommandHandlerUsecaseSpec);
fs.writeFileSync(deleteCommandHandlerUsecasePath, deleteCommandHandlerUsecase);
fs.writeFileSync(deleteCommandOutputUsecasePath, deleteCommandOutputUsecase);
fs.writeFileSync(schemaPath, schema);
fs.writeFileSync(entityDbPath, entityDb);
fs.writeFileSync(repositorySpecPath, repositorySpec);
fs.writeFileSync(repositoryPath, repository);
fs.writeFileSync(controllerSpecPath, controllerSpec);
fs.writeFileSync(controllerPath, controller);

console.log('\n\x1b[32mGenerate module "' + moduleName + '" successfully.\x1b[0m\n');

/**
 * Get content of special file
 * @param {string} path Generate source code to directory
 */
function getFileContent(path) {
    return fs.readFileSync(path, 'utf8')
        .replace(/{folder}/g, folder)
        .replace(/{subFolder}/g, subFolder)
        .replace(/{moduleNameText}/g, moduleNameText)
        .replace(/{moduleNameTextLowerCase}/g, moduleNameTextLowerCase)
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
