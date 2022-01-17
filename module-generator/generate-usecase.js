/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const param = process.argv.length > 2 && process.argv[2];
const param2 = process.argv.length > 3 && process.argv[3];

if (!param || !param2 || param2.split('#').length !== 2) throw new Error('\x1b[35mParam is invalid!\n\x1b[0m');

let moduleName = param;
let subModuleName = moduleName;
const methodName = param2.split('#')[0];
const usecaseFncName = param2.split('#')[1];

if (moduleName.includes('#')) {
  subModuleName = moduleName.split('#')[1];
  moduleName = moduleName.split('#')[0];

  if (!moduleName || !subModuleName) throw new Error('Missing name of the module or sub module!');

  console.log('Module:\x1b[32m', moduleName, '\x1b[0m');
  console.log('Sub-Module:\x1b[32m', subModuleName, '\x1b[0m');
  // eslint-disable-next-line prettier/prettier
}
else console.log('Module:\x1b[32m', moduleName, '\x1b[0m');

const folder = convertToDirectoryName(moduleName);
const subFolder = convertToDirectoryName(subModuleName);

let moduleNameText = convertToDirectoryName(subModuleName).replace(/-/g, ' ').toLowerCase();
moduleNameText = moduleNameText.substring(0, 1).toUpperCase() + moduleNameText.substring(1);
const moduleNameTextLowerCase = moduleNameText.toLowerCase();

let usecaseFncNameText = convertToDirectoryName(usecaseFncName).replace(/-/g, ' ').toLowerCase();
usecaseFncNameText = usecaseFncNameText.substring(0, 1).toUpperCase() + usecaseFncNameText.substring(1);

console.log('Method:\x1b[32m', methodName, '\x1b[0m');
console.log('Usecase:\x1b[32m', usecaseFncName, '\x1b[0m');

const methods = ['find', 'get', 'create', 'update', 'delete'];

if (!subModuleName || !methodName || !usecaseFncName) throw new Error('\x1b[35mMissing param!\n\x1b[0m');

const methodNameLowerCase = methodName.toLowerCase();
if (!methods.includes(methodNameLowerCase)) throw new Error('\x1b[35mMethod name is invalid!\n\x1b[0m');

const usecaseFncFolder = convertToDirectoryName(usecaseFncName);
const camelName = subModuleName.substring(0, 1).toLowerCase() + subModuleName.substring(1);
const pascalName = subModuleName.substring(0, 1).toUpperCase() + subModuleName.substring(1);

const upperCaseName = convertToDirectoryName(subModuleName).replace(/-/g, '_').toUpperCase();
const lowerCaseName = upperCaseName.toLowerCase();

const usecaseHandlerSpecPath = path.join(__dirname, `../src/application/usecases/${folder}/${subFolder}/${usecaseFncFolder}/${usecaseFncName}Handler.spec.ts`);
const usecaseHandlerSpec = getFileContent(path.join(__dirname, `./application/usecases/${methodNameLowerCase}/${methodName}Handler.spec.tmp`));

const usecaseHandlerPath = path.join(__dirname, `../src/application/usecases/${folder}/${subFolder}/${usecaseFncFolder}/${usecaseFncName}Handler.ts`);
const usecaseHandler = getFileContent(path.join(__dirname, `./application/usecases/${methodNameLowerCase}/${methodName}Handler.tmp`));

const usecaseSchemaPath = path.join(__dirname, `../src/application/usecases/${folder}/${subFolder}/${usecaseFncFolder}/${usecaseFncName}Schema.ts`);
const usecaseSchema = getFileContent(path.join(__dirname, `./application/usecases/${methodNameLowerCase}/${methodName}Schema.tmp`));

createDirectories(usecaseHandlerPath);

fs.writeFileSync(usecaseHandlerSpecPath, usecaseHandlerSpec);
fs.writeFileSync(usecaseHandlerPath, usecaseHandler);
fs.writeFileSync(usecaseSchemaPath, usecaseSchema);

console.log('\n\x1b[32mGenerate usecase "' + usecaseFncName + '" successfully.\x1b[0m\n');

/**
 * Get content of special file
 * @param {string} path Generate source code to directory
 */
function getFileContent(path) {
  return fs
    .readFileSync(path, 'utf8')
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
    if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });
  }
}

/**
 * Convert directory name
 * @param {string} directoryName directory name
 */
function convertToDirectoryName(directoryName) {
  let match;
  while ((match = /[A-Z]/g.exec(directoryName)) != null) {
    if (match.index === 0) directoryName = directoryName[match.index].toLowerCase() + directoryName.substring(match.index + 1);
    else directoryName = directoryName.substring(0, match.index) + '-' + directoryName[match.index].toLowerCase() + directoryName.substring(match.index + 1);
  }
  return directoryName;
}
