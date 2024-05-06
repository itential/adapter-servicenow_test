/* eslint-disable */
const fs = require('fs');

const blacklistTasks = [
  'genericAdapterRequest',
  'genericAdapterRequestNoBasePath',
  'hasEntities',
  'healthcheck'
];

const adapterBaseTasks = [
    'getDevicesFiltered',
    'isAlive',
    'getConfig',
    'getDevice',
    'iapUpdateAdapterConfiguration',
    'iapFindAdapterPath',
    'iapSuspendAdapter',
    'iapUnsuspendAdapter',
    'iapGetAdapterQueue',
    'iapTroubleshootAdapter',
    'iapRunAdapterHealthcheck',
    'iapRunAdapterConnectivity',
    'iapRunAdapterBasicGet',
    'iapMoveAdapterEntitiesToDB',
    'getDevice',
    'getDevicesFiltered',
    'isAlive',
    'getConfig',
    'iapGetDeviceCount',
    'iapRunAdapterLint',
    'iapRunAdapterTests',
    'iapGetAdapterInventory'
];

function updatePronghorn(tasks, original, updated) {
  const originalFile = require(original);
  const unusedMethods = [];
  const usedMethods = originalFile.methods.filter((method) => {
    if (tasks.includes(method.name)) {
      unusedMethods.push(method);
      return false;
    }
    return true;
  });
  //write used and unused to new files
  let updatedFile;
  if (!fs.existsSync(updated)) {
    updatedFile = { ...originalFile, methods: [], src: 'adapter-inactive.js' };
  } else {
    updatedFile = require(updated);
  }
  updatedFile.methods = updatedFile.methods.concat(unusedMethods);
  originalFile.methods = usedMethods;
  fs.writeFileSync(updated, JSON.stringify(updatedFile, null, 2));
  fs.writeFileSync(original, JSON.stringify(originalFile, null, 2));
  return 'Done';
}

function flipTaskFlag(task, pronghornPath, value)
{
  const pronghorn = require(pronghornPath);
  const index = pronghorn.methods.findIndex((method) => method.name === task);
  pronghorn.methods[index] = { ...pronghorn.methods[index], task: value };
  fs.writeFileSync(pronghornPath, JSON.stringify(pronghorn, null, 2));
}

//Return array of relevant paths given adapter directory
function createPaths(currentAdapter) {
  const paths = [];
  const filePaths = [
    'adapter.js',
    'pronghorn.json',
    'test/integration/adapterTestIntegration.js',
    'test/unit/adapterTestUnit.js',
    'adapter-inactive.js',
    'pronghorn-inactive.json',
  ];
  filePaths.forEach((file) => {
    paths.push(`${currentAdapter}/${file}`);
  });
  return paths;
}

function insert(str, index, value) {
  return str.substr(0, index) + value + str.substr(index);
}

//modify adapter js
//original - path to file containing tasks we want to remove
// updated - path to file we want to move the tasks to
function updateAdapterJs(tasks, original, updated, adapterDir) {
  if (!fs.existsSync(original)) {
    //could do this or just let the error ocurr lower down and catch in warpper
    throw new Error(`Original file ${original} does not exist.`);
  }
  let originalFile = fs.readFileSync(original, 'utf8');
  let updatedFile;
  if (!fs.existsSync(updated)) {
    const adapterExport = require(`${adapterDir}/pronghorn.json`).export;
    updatedFile = `/* @copyright Itential, LLC 2019 */\n\n/* eslint import/no-dynamic-require: warn */\n/* eslint no-unused-vars: warn */\n/* global log */\n\nconst path = require('path');\n\nconst AdapterBaseCl = require(path.join(__dirname, 'adapterBase.js'));\n\nclass ${adapterExport}Inactive extends AdapterBaseCl {}\n`;
    //To do handles backup files where og doesn't exist
  } else {
    updatedFile = fs.readFileSync(updated, 'utf8');
  }

  tasks.forEach((method) => {
    //accounting for different js docs format
    const comment = originalFile.indexOf(`* @function ${method}`);
    const start = originalFile.slice(0, comment).lastIndexOf('/**');
    if (start !== -1) {
      //next comment block
      const end = originalFile.indexOf('/**\n', start + 1);
      let func = end === -1
        ? originalFile.substring(start - 3, originalFile.lastIndexOf('}'))
        : originalFile.substring(start, end);
      originalFile = originalFile.replace(func, '');
      func = '\n  ' + func.trim() + '\n';
      updatedFile = insert(updatedFile, updatedFile.lastIndexOf('}'), func);
    } else {
      console.log(`Task ${method} wasn't found in original file. Skipping.`);
    }
  });
  fs.writeFileSync(original, originalFile, 'utf8');
  fs.writeFileSync(updated, updatedFile, 'utf8');
  return 'done';
}

//Update test file for when we deactivate a task
function deactivateTest(adapterPath, testPath, tasks) {
  let unitTest = fs.readFileSync(`${adapterPath}/${testPath}`, 'utf8');
  tasks.forEach((task) => {
    const searchStr = `describe('#${task}`;
    unitTest = unitTest.replace(searchStr, `describe.skip('#${task}`);
  });
  fs.writeFileSync(`${adapterPath}/${testPath}`, unitTest, 'utf8');
}

//Update test file when we activate tasks
function activateTest(adapterPath, testPath, tasks) {
  let unitTest = fs.readFileSync(`${adapterPath}/${testPath}`, 'utf8');
  //tasks ==> toMove
  tasks.forEach((task) => {
    const searchStr = `describe.skip('#${task}`;
    unitTest = unitTest.replace(searchStr, `describe('#${task}`);
  });
  fs.writeFileSync(`${adapterPath}/${testPath}`, unitTest, 'utf8');
}

//backups are not actually being written back
function rollbackChanges(adapterPath) {
  const backups = fs.readdirSync(`${adapterPath}/temp`); //this is an array of file names not the full path
  const filePaths = createPaths(adapterPath);
  for (let i = 0; i < backups.length; i++) {
    const file = fs.readFileSync(`${adapterPath}/temp/${backups[i]}`, 'utf8'); //make sure this is getting the file
    const currentFile = filePaths.find((path) => {
      const index = path.split('/').length - 1;
      const fileName = path.split('/')[index];
      return fileName === backups[i].replace('temp-', '');
    }); //returns undefined if no match

    if (currentFile) {
      fs.writeFileSync(currentFile, file, 'utf8');
    }
  }
  //inactive didn't exist before script
  if (!backups.includes('temp-adapter-inactive.js')) {
    fs.unlinkSync(`${adapterPath}/pronghorn-inactive.json`);
    fs.unlinkSync(`${adapterPath}/adapter-inactive.js`);
  }
  deleteBackups(adapterPath);
}

function deleteBackups(adapterPath) {
  fs.rmSync(`${adapterPath}/temp`, { recursive: true });
}

function activateTasks(adapterDir, tasks) {
  const toDelete = [];
  const backupFiles = [];
  const filePaths = createPaths(adapterDir);
  try {
    //take backup of each file here
    if (!fs.existsSync(`${adapterDir}/temp`)) {
      fs.mkdirSync(`${adapterDir}/temp`);
    }
    filePaths.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        const index = filePath.split('/').length - 1;
        const backupName = `temp-${filePath.split('/')[index]}`;
        backupFiles.push(`${adapterDir}/temp/${backupName}`);
        fs.copyFileSync(filePath, `${adapterDir}/temp/${backupName}`);
      } else {
        //File doesn't exist before script
        toDelete.push(filePath);
      }
    });
    tasks = tasks.filter((task) => {
      if (adapterBaseTasks.includes(task)) {
        flipTaskFlag(task, `${adapterDir}/pronghorn.json`, true);
        return false;
      } else {
        return true;
      }
    });
    updateAdapterJs(
      tasks,
      `${adapterDir}/adapter-inactive.js`,
      `${adapterDir}/adapter.js`,
      adapterDir
    );
    updatePronghorn(
      tasks,
      `${adapterDir}/pronghorn-inactive.json`,
      `${adapterDir}/pronghorn.json`
    );
    activateTest(
      adapterDir,
      '/test/integration/adapterTestIntegration.js',
      tasks
    );
    activateTest(adapterDir, '/test/unit/adapterTestUnit.js', tasks);
    return 'success';
  } catch (e) {
    console.log(`Error: ${e} ocurred during execution. Rolling back changes.`);
    for (let i = 0; i < backupFiles.length; i++) {
      const file = fs.readFileSync(backupFiles[i], 'utf8');
      fs.writeFileSync(filePaths[i], file, 'utf8');
    }
    toDelete.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
    deleteBackups(adapterDir);
    process.exit(1);
  }
}

//moving from adapter.js to adapter-inactive.js
function deactivateTasks(adapterDir, tasks) {
  const toDelete = [];
  const backupFiles = [];
  const filePaths = createPaths(adapterDir);
  try {
    //take backup of each file here
    if (!fs.existsSync(`${adapterDir}/temp`)) {
      fs.mkdirSync(`${adapterDir}/temp`);
    }
    filePaths.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        const index = filePath.split('/').length - 1;
        const backupName = `temp-${filePath.split('/')[index]}`;
        backupFiles.push(`${adapterDir}/temp/${backupName}`);
        fs.copyFileSync(filePath, `${adapterDir}/temp/${backupName}`);
      } else {
        //File doesn't exist before script
        toDelete.push(filePath);
      }
    });
    //filter tasks for blacklisted tasks or IAP tasks
    tasks = tasks.filter((task) => {
      if (blacklistTasks.includes(task)) {
        console.log(`${task} cannot be deactivated.`);
        return false;
      } else if (adapterBaseTasks.includes(task)) {
        flipTaskFlag(task, `${adapterDir}/pronghorn.json`, false);
        return false;
      } else {
        return true;
      }
    });
    updateAdapterJs(
      tasks,
      `${adapterDir}/adapter.js`,
      `${adapterDir}/adapter-inactive.js`,
      adapterDir
    );
    updatePronghorn(
      tasks,
      `${adapterDir}/pronghorn.json`,
      `${adapterDir}/pronghorn-inactive.json`
    );
    deactivateTest(
      adapterDir,
      '/test/integration/adapterTestIntegration.js',
      tasks
    );
    deactivateTest(adapterDir, '/test/unit/adapterTestUnit.js', tasks);
    return 'success';
  } catch (e) {
    console.log(`Error: ${e} ocurred during execution. Rolling back changes.`);
    for (let i = 0; i < backupFiles.length; i++) {
      const file = fs.readFileSync(backupFiles[i], 'utf8');
      fs.writeFileSync(filePaths[i], file, 'utf8');
    }
    toDelete.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
    deleteBackups(adapterDir);
    process.exit(1);
  }
}

module.exports = {
  activateTasks, deactivateTasks, rollbackChanges, deleteBackups
};
