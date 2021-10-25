/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

let moduleName = process.argv.length > 2 && process.argv[2].trim();
let subModuleName = moduleName;
if (!moduleName)
    throw new Error('Missing name of the module!');

if (moduleName.includes('#')) {
    subModuleName = moduleName.split('#')[1];
    moduleName = moduleName.split('#')[0];

    if (!moduleName || !subModuleName)
        throw new Error('Missing name of the module or sub module!');

    console.log('Module:\x1b[32m', moduleName, '\x1b[0m');
    console.log('Sub-Module:\x1b[32m', subModuleName, '\x1b[0m');
}
else
    console.log('Module:\x1b[32m', moduleName, '\x1b[0m');

const folder = convertToDirectoryName(moduleName);
const subFolder = convertToDirectoryName(subModuleName);

let moduleNameText = convertToDirectoryName(subModuleName).replace(/-/g, ' ').toLowerCase();
moduleNameText = moduleNameText.substr(0, 1).toUpperCase() + moduleNameText.substr(1);
const moduleNameTextLowerCase = moduleNameText.toLowerCase();

const camelName = subModuleName.substr(0, 1).toLowerCase() + subModuleName.substr(1);
const pascalName = subModuleName.substr(0, 1).toUpperCase() + subModuleName.substr(1);

const upperCaseName = convertToDirectoryName(subModuleName).replace(/-/g, '_').toUpperCase();
const lowerCaseName = upperCaseName.toLowerCase();

const findUsecaseFncName = `Find${pascalName}`;
const getUsecaseFncName = `Get${pascalName}`;
const createUsecaseFncName = `Create${pascalName}`;
const updateUsecaseFncName = `Update${pascalName}`;
const deleteUsecaseFncName = `Delete${pascalName}`;

// core

const entityInterfacePath = path.join(__dirname, `../src/core/domain/interfaces/${folder}/I${pascalName}.ts`);
const entityInterface = getFileContent(path.join(__dirname, './core/domain/Interface.tmp'));

const entitySpecPath = path.join(__dirname, `../src/core/domain/entities/${folder}/${pascalName}.spec.ts`);
const entitySpec = getFileContent(path.join(__dirname, './core/domain/Entity.spec.tmp'));

const entityPath = path.join(__dirname, `../src/core/domain/entities/${folder}/${pascalName}.ts`);
const entity = getFileContent(path.join(__dirname, './core/domain/Entity.tmp'));

const repositoryInterfacePath = path.join(__dirname, `../src/core/gateways/repositories/${folder}/I${pascalName}Repository.ts`);
const repositoryInterface = getFileContent(path.join(__dirname, './core/gateways/IRepository.tmp'));

const findHandlerUsecaseSpecPath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/find-${subFolder}/${findUsecaseFncName}Handler.spec.ts`);
const findHandlerUsecaseSpec = getFileContent(path.join(__dirname, './core/usecases/find/FindHandler.spec.tmp'))
    .replace(/{usecaseFncNameText}/g, `Find ${moduleNameTextLowerCase}`);

const findHandlerUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/find-${subFolder}/${findUsecaseFncName}Handler.ts`);
const findHandlerUsecase = getFileContent(path.join(__dirname, './core/usecases/find/FindHandler.tmp'));

const findInputUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/find-${subFolder}/${findUsecaseFncName}Input.ts`);
const findInputUsecase = getFileContent(path.join(__dirname, './core/usecases/find/FindInput.tmp'));

const findOutputUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/find-${subFolder}/${findUsecaseFncName}Output.ts`);
const findOutputUsecase = getFileContent(path.join(__dirname, './core/usecases/find/FindOutput.tmp'));

const getHandlerUsecaseSpecPath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/get-${subFolder}/${getUsecaseFncName}Handler.spec.ts`);
const getHandlerUsecaseSpec = getFileContent(path.join(__dirname, './core/usecases/get/GetHandler.spec.tmp'))
    .replace(/{usecaseFncNameText}/g, `Get ${moduleNameTextLowerCase}`);

const getHandlerUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/get-${subFolder}/${getUsecaseFncName}Handler.ts`);
const getHandlerUsecase = getFileContent(path.join(__dirname, './core/usecases/get/GetHandler.tmp'));

const getOutputUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/get-${subFolder}/${getUsecaseFncName}Output.ts`);
const getOutputUsecase = getFileContent(path.join(__dirname, './core/usecases/get/GetOutput.tmp'));

const createHandlerUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/create-${subFolder}/${createUsecaseFncName}Handler.ts`);
const createHandlerUsecase = getFileContent(path.join(__dirname, './core/usecases/create/CreateHandler.tmp'));

const createHandlerUsecaseSpecPath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/create-${subFolder}/${createUsecaseFncName}Handler.spec.ts`);
const createHandlerUsecaseSpec = getFileContent(path.join(__dirname, './core/usecases/create/CreateHandler.spec.tmp'))
    .replace(/{usecaseFncNameText}/g, `Create ${moduleNameTextLowerCase}`);

const createInputUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/create-${subFolder}/${createUsecaseFncName}Input.ts`);
const createInputUsecase = getFileContent(path.join(__dirname, './core/usecases/create/CreateInput.tmp'));

const createOutputUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/create-${subFolder}/${createUsecaseFncName}Output.ts`);
const createOutputUsecase = getFileContent(path.join(__dirname, './core/usecases/create/CreateOutput.tmp'));

const updateHandlerUsecaseSpecPath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/update-${subFolder}/${updateUsecaseFncName}Handler.spec.ts`);
const updateHandlerUsecaseSpec = getFileContent(path.join(__dirname, './core/usecases/update/UpdateHandler.spec.tmp'))
    .replace(/{usecaseFncNameText}/g, `Update ${moduleNameTextLowerCase}`);

const updateHandlerUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/update-${subFolder}/${updateUsecaseFncName}Handler.ts`);
const updateHandlerUsecase = getFileContent(path.join(__dirname, './core/usecases/update/UpdateHandler.tmp'));

const updateInputUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/update-${subFolder}/${updateUsecaseFncName}Input.ts`);
const updateInputUsecase = getFileContent(path.join(__dirname, './core/usecases/update/UpdateInput.tmp'));

const updateOutputUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/update-${subFolder}/${updateUsecaseFncName}Output.ts`);
const updateOutputUsecase = getFileContent(path.join(__dirname, './core/usecases/update/UpdateOutput.tmp'));

const deleteHandlerUsecaseSpecPath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/delete-${subFolder}/${deleteUsecaseFncName}Handler.spec.ts`);
const deleteHandlerUsecaseSpec = getFileContent(path.join(__dirname, './core/usecases/delete/DeleteHandler.spec.tmp'))
    .replace(/{usecaseFncNameText}/g, `Delete ${moduleNameTextLowerCase}`);

const deleteHandlerUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/delete-${subFolder}/${deleteUsecaseFncName}Handler.ts`);
const deleteHandlerUsecase = getFileContent(path.join(__dirname, './core/usecases/delete/DeleteHandler.tmp'));

const deleteOutputUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/delete-${subFolder}/${deleteUsecaseFncName}Output.ts`);
const deleteOutputUsecase = getFileContent(path.join(__dirname, './core/usecases/delete/DeleteOutput.tmp'));

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
    findHandlerUsecasePath,
    getHandlerUsecasePath,
    createHandlerUsecasePath,
    updateHandlerUsecasePath,
    deleteHandlerUsecasePath,
    schemaPath,
    entityDbPath,
    repositoryPath,
    controllerPath
);

fs.writeFileSync(entityInterfacePath, entityInterface);
fs.writeFileSync(entitySpecPath, entitySpec);
fs.writeFileSync(entityPath, entity);
fs.writeFileSync(repositoryInterfacePath, repositoryInterface);
fs.writeFileSync(findHandlerUsecaseSpecPath, findHandlerUsecaseSpec);
fs.writeFileSync(findHandlerUsecasePath, findHandlerUsecase);
fs.writeFileSync(findInputUsecasePath, findInputUsecase);
fs.writeFileSync(findOutputUsecasePath, findOutputUsecase);
fs.writeFileSync(getHandlerUsecaseSpecPath, getHandlerUsecaseSpec);
fs.writeFileSync(getHandlerUsecasePath, getHandlerUsecase);
fs.writeFileSync(getOutputUsecasePath, getOutputUsecase);
fs.writeFileSync(createHandlerUsecaseSpecPath, createHandlerUsecaseSpec);
fs.writeFileSync(createHandlerUsecasePath, createHandlerUsecase);
fs.writeFileSync(createInputUsecasePath, createInputUsecase);
fs.writeFileSync(createOutputUsecasePath, createOutputUsecase);
fs.writeFileSync(updateHandlerUsecaseSpecPath, updateHandlerUsecaseSpec);
fs.writeFileSync(updateHandlerUsecasePath, updateHandlerUsecase);
fs.writeFileSync(updateInputUsecasePath, updateInputUsecase);
fs.writeFileSync(updateOutputUsecasePath, updateOutputUsecase);
fs.writeFileSync(deleteHandlerUsecaseSpecPath, deleteHandlerUsecaseSpec);
fs.writeFileSync(deleteHandlerUsecasePath, deleteHandlerUsecase);
fs.writeFileSync(deleteOutputUsecasePath, deleteOutputUsecase);
fs.writeFileSync(schemaPath, schema);
fs.writeFileSync(entityDbPath, entityDb);
fs.writeFileSync(repositorySpecPath, repositorySpec);
fs.writeFileSync(repositoryPath, repository);
fs.writeFileSync(controllerSpecPath, controllerSpec);
fs.writeFileSync(controllerPath, controller);

console.log('\n\x1b[32mGenerate module "' + process.argv[2] + '" successfully.\x1b[0m\n');

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
        .replace(/{FindUsecaseName}/g, findUsecaseFncName)
        .replace(/{GetUsecaseName}/g, getUsecaseFncName)
        .replace(/{CreateUsecaseName}/g, createUsecaseFncName)
        .replace(/{UpdateUsecaseName}/g, updateUsecaseFncName)
        .replace(/{DeleteUsecaseName}/g, deleteUsecaseFncName)
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
