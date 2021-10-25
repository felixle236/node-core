/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const param = process.argv.length > 2 && process.argv[2].trim();
const param2 = process.argv.length > 3 && process.argv[3].trim();

if (!param || !param2 || param2.split('#').length !== 2)
    throw new Error('\x1b[35mParam is invalid!\n\x1b[0m');

let moduleName = param;
let subModuleName = moduleName;

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

const methodName = param2.split('#')[0];
const usecaseFncName = param2.split('#')[1];
let usecaseFncNameText = convertToDirectoryName(usecaseFncName).replace(/-/g, ' ').toLowerCase();
usecaseFncNameText = usecaseFncNameText.substr(0, 1).toUpperCase() + usecaseFncNameText.substr(1);

console.log('Method:\x1b[32m', methodName, '\x1b[0m');
console.log('Usecase:\x1b[32m', usecaseFncName, '\x1b[0m');

const methods = ['find', 'get', 'create', 'update', 'delete'];

if (!subModuleName || !methodName || !usecaseFncName)
    throw new Error('\x1b[35mMissing param!\n\x1b[0m');

const methodNameLowerCase = methodName.toLowerCase();
if (!methods.includes(methodNameLowerCase))
    throw new Error('\x1b[35mMethod name is invalid!\n\x1b[0m');

const usecaseFncFolder = convertToDirectoryName(usecaseFncName);
const camelName = subModuleName.substr(0, 1).toLowerCase() + subModuleName.substr(1);
const pascalName = subModuleName.substr(0, 1).toUpperCase() + subModuleName.substr(1);

const upperCaseName = convertToDirectoryName(subModuleName).replace(/-/g, '_').toUpperCase();
const lowerCaseName = upperCaseName.toLowerCase();

const usecaseHandlerSpecPath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/${usecaseFncFolder}/${usecaseFncName}Handler.spec.ts`);
const usecaseHandlerSpec = getFileContent(path.join(__dirname, `./core/usecases/${methodNameLowerCase}/${methodName}Handler.spec.tmp`));

const usecaseHandlerPath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/${usecaseFncFolder}/${usecaseFncName}Handler.ts`);
const usecaseHandler = getFileContent(path.join(__dirname, `./core/usecases/${methodNameLowerCase}/${methodName}Handler.tmp`));

const usecaseOutputPath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/${usecaseFncFolder}/${usecaseFncName}Output.ts`);
const usecaseOutput = getFileContent(path.join(__dirname, `./core/usecases/${methodNameLowerCase}/${methodName}Output.tmp`));

createDirectories(
    usecaseHandlerPath
);

fs.writeFileSync(usecaseHandlerSpecPath, usecaseHandlerSpec);
fs.writeFileSync(usecaseHandlerPath, usecaseHandler);
fs.writeFileSync(usecaseOutputPath, usecaseOutput);

if (['find', 'create', 'update'].includes(methodNameLowerCase)) {
    const usecaseInputPath = path.join(__dirname, `../src/core/usecases/${folder}/${subFolder}/${usecaseFncFolder}/${usecaseFncName}Input.ts`);
    const usecaseInput = getFileContent(path.join(__dirname, `./core/usecases/${methodNameLowerCase}/${methodName}Input.tmp`));

    fs.writeFileSync(usecaseInputPath, usecaseInput);
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
        .replace(/{FindUsecaseName}/g, usecaseFncName)
        .replace(/{GetUsecaseName}/g, usecaseFncName)
        .replace(/{CreateUsecaseName}/g, usecaseFncName)
        .replace(/{UpdateUsecaseName}/g, usecaseFncName)
        .replace(/{DeleteUsecaseName}/g, usecaseFncName)
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
