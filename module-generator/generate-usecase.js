/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const param = process.argv.length > 2 && process.argv[2].trim();
if (!param.includes(':') || param.split(':').length !== 3)
    throw new Error('\x1b[35mParam is invalid!\n\x1b[0m');

let moduleName = param.split(':')[0];
let folder = moduleName;

if (moduleName.includes('#')) {
    folder = moduleName.split('#')[0];
    moduleName = moduleName.split('#')[1];

    if (!folder || !moduleName)
        throw new Error('\x1b[35mMissing name of the module or sub module!\n\x1b[0m');

    if (folder === moduleName)
        throw new Error('\x1b[35mThe name of module cannot match sub module!\n\x1b[0m');

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
const methodName = param.split(':')[1];
const usecaseFncName = param.split(':')[2];
let usecaseFncNameText = convertToDirectoryName(usecaseFncName).replace(/-/g, ' ').toLowerCase();
usecaseFncNameText = usecaseFncNameText.substr(0, 1).toUpperCase() + usecaseFncNameText.substr(1);

console.log('Method:\x1b[32m', methodName, '\x1b[0m');
console.log('Usecase:\x1b[32m', usecaseFncName, '\x1b[0m');

if (!moduleName || !methodName || !usecaseFncName)
    throw new Error('\x1b[35mMissing param!\n\x1b[0m');

const usecaseFncFolder = convertToDirectoryName(usecaseFncName);
const camelName = moduleName.substr(0, 1).toLowerCase() + moduleName.substr(1);
const pascalName = moduleName.substr(0, 1).toUpperCase() + moduleName.substr(1);
const upperCaseName = convertToDirectoryName(moduleName).replace(/-/g, '_').toUpperCase();
const lowerCaseName = upperCaseName.toLowerCase();

if (methodName.toLowerCase() === 'query') {
    const queryHandlerUsecaseSpecPath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/queries/${usecaseFncFolder}/${usecaseFncName}QueryHandler.spec.ts`);
    const queryHandlerUsecaseSpec = getFileContent(path.join(__dirname, './core/usecases/queries/usecase-query-func/UsecaseQueryHandler.spec.tmp'));

    const queryHandlerUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/queries/${usecaseFncFolder}/${usecaseFncName}QueryHandler.ts`);
    const queryHandlerUsecase = getFileContent(path.join(__dirname, './core/usecases/queries/usecase-query-func/UsecaseQueryHandler.tmp'));

    const queryUsecaseOutputPath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/queries/${usecaseFncFolder}/${usecaseFncName}QueryOutput.ts`);
    const queryUsecaseOutput = getFileContent(path.join(__dirname, './core/usecases/queries/usecase-query-func/UsecaseQueryOutput.tmp'));

    createDirectories(
        queryHandlerUsecasePath
    );

    fs.writeFileSync(queryHandlerUsecaseSpecPath, queryHandlerUsecaseSpec);
    fs.writeFileSync(queryHandlerUsecasePath, queryHandlerUsecase);
    fs.writeFileSync(queryUsecaseOutputPath, queryUsecaseOutput);
}
else if (methodName.toLowerCase() === 'command') {
    const commandHandlerUsecaseSpecPath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/commands/${usecaseFncFolder}/${usecaseFncName}CommandHandler.spec.ts`);
    const commandHandlerUsecaseSpec = getFileContent(path.join(__dirname, './core/usecases/commands/usecase-command-func/UsecaseCommandHandler.spec.tmp'));

    const commandHandlerUsecasePath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/commands/${usecaseFncFolder}/${usecaseFncName}CommandHandler.ts`);
    const commandHandlerUsecase = getFileContent(path.join(__dirname, './core/usecases/commands/usecase-command-func/UsecaseCommandHandler.tmp'));

    const commandUsecaseInputPath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/commands/${usecaseFncFolder}/${usecaseFncName}CommandInput.ts`);
    const commandUsecaseInput = getFileContent(path.join(__dirname, './core/usecases/commands/usecase-command-func/UsecaseCommandInput.tmp'));

    const commandUsecaseOutputPath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/commands/${usecaseFncFolder}/${usecaseFncName}CommandOutput.ts`);
    const commandUsecaseOutput = getFileContent(path.join(__dirname, './core/usecases/commands/usecase-command-func/UsecaseCommandOutput.tmp'));

    createDirectories(
        commandHandlerUsecasePath
    );

    fs.writeFileSync(commandHandlerUsecaseSpecPath, commandHandlerUsecaseSpec);
    fs.writeFileSync(commandHandlerUsecasePath, commandHandlerUsecase);
    fs.writeFileSync(commandUsecaseInputPath, commandUsecaseInput);
    fs.writeFileSync(commandUsecaseOutputPath, commandUsecaseOutput);
}

console.log('\n\x1b[32mGenerate usecase "' + usecaseFncName + '" successfully.\x1b[0m\n');

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
        .replace(/{UsecaseName}/g, usecaseFncName)
        .replace(/{usecaseFncNameText}/g, usecaseFncNameText)
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
