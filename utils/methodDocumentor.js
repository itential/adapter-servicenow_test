/* eslint global-require:warn */
/* eslint import/no-dynamic-require:warn */
/* eslint no-param-reassign:warn */

const fs = require('fs-extra');
const acorn = require('acorn');

// Getting the base directory:
let adaptdir = __dirname;
if (adaptdir.endsWith('/utils')) {
  adaptdir = adaptdir.substring(0, adaptdir.length - 6);
}

function createObjectForFunction(
  funcName,
  funcArgs,
  entityPath,
  description,
  workflow
) {
  const funcObject = {};
  // if the entity path is not set, then the object is not created.
  if (entityPath !== undefined) {
    funcObject.method_signature = `${funcName}(${funcArgs.join(', ')})`;
    funcObject.path = entityPath;
    if (description === undefined) {
      funcObject.description = '';
      funcObject.workflow = 'No';
    } else {
      funcObject.description = description;
      funcObject.workflow = workflow;
    }
  }
  return funcObject;
}

function getPathFromEntity(entity, funcName) {
  let epath;
  if (entity === undefined || entity === '.generic') {
    epath = undefined;
  } else {
    // Access the action.js file for the certain entity to get the path
    const entityPath = `${adaptdir}/entities/${entity}/action.json`;
    const actionJSON = require(entityPath);
    actionJSON.actions.forEach((action) => {
      if (action.name === funcName) {
        if (typeof action.entitypath === 'object') {
          epath = '';
          const keys = Object.keys(action.entitypath);
          for (let k = 0; k < keys.length; k += 1) {
            epath += `${keys[k]}:${action.entitypath[keys[k]]} <br /> `;
          }
          epath = epath.substring(0, epath.length - 8);
        } else {
          epath = action.entitypath;
        }
      }
    });
  }
  return epath;
}

function recurseCallExpressions(statement, callList) {
  // Recursively finds all CallExpressions in the syntax tree
  if (statement.type === 'CallExpression') callList.push(statement);
  const keys = Object.keys(statement);
  for (let k = 0; k < keys.length; k += 1) {
    if (typeof statement[keys[k]] === 'object' && statement[keys[k]] !== null) {
      recurseCallExpressions(statement[keys[k]], callList);
    }
  }
}

function readFileUsingLib(filename, descriptionObj, workflowObj, functionList) {
  // read the file
  const aFile = fs.readFileSync(filename, 'utf8');
  // parsing the file to get the function and class declarations.
  const aFileFuncArgs = acorn.parse(aFile, { ecmaVersion: 2020 });

  let callName = 'identifyRequest';
  // Looping through all the declarations parsed:
  aFileFuncArgs.body.forEach((e) => {
    // Getting only the class declaration as it has our required functions.
    if (e.type === 'ClassDeclaration') {
      const methodDefinition = e.body;
      methodDefinition.body.forEach((method) => {
        // Getting method name and its params in the class.
        const funcName = method.key.name;
        const funcArgs = [];
        method.value.params.forEach((param) => {
          if (param.type === 'Identifier') {
            funcArgs.push(param.name);
          } else if (param.type === 'RestElement') {
            funcArgs.push(`...${param.argument.name}`);
          } else {
            const args = `${param.left.name} = ${param.right.raw}`;
            funcArgs.push(args);
          }
        });

        // Getting the entity for the method:
        const callList = [];
        method.value.body.body.forEach((statement) => {
          recurseCallExpressions(statement, callList);
        });
        const requests = [];
        for (let i = 0; i < callList.length; i += 1) {
          if (callList[i].callee.property && callList[i].callee.property.name === callName) {
            requests.push(callList[i]);
          }
        }
        if (requests.length > 0) {
          const expr = requests[0];
          if (expr.arguments.length < 2) {
            throw new Error(`Bad inputs in method ${funcName}`);
          }
          const entity = expr.arguments[0].value;
          const actionName = expr.arguments[1].value;
          if (expr !== undefined && (expr.arguments[0].type !== 'Literal' || expr.arguments[1].type !== 'Literal')) {
            const param1 = method.value.params[0];
            const param2 = method.value.params[1];
            if (param1.type !== 'Identifier' || param2.type !== 'Identifier'
                || expr.arguments[0].type !== 'Identifier' || expr.arguments[1].type !== 'Identifier'
                || param1.name !== expr.arguments[0].name || param2.name !== expr.arguments[1].name) {
              throw new Error(`identifyRequest proxy method ${funcName} unknown format`);
            } else if (callName !== 'identifyRequest') {
              throw new Error(`MethodDocumentor not yet programmed to handle multiple helper methods: 1) ${callName}, 2) ${funcName}`);
            }
            callName = funcName;
          }
          const entityPath = getPathFromEntity(entity, actionName);

          // Creating and storing the object for the method.
          if (entityPath !== undefined) {
            functionList.push(
              createObjectForFunction(
                funcName,
                funcArgs,
                entityPath,
                descriptionObj[funcName],
                workflowObj[funcName]
              )
            );
          }
        }
      });
    }
  });
}

function readJSONFile(filename, descriptionObj, workflowObj) {
  // Accessing the JSON file.
  const phJSON = require(filename);
  // Getting the methods array.
  const methodArray = phJSON.methods;
  methodArray.forEach((methodName) => {
    // Getting the method description and workflow:
    const funcName = methodName.name;
    descriptionObj[funcName] = methodName.summary ? methodName.summary : methodName.description;
    workflowObj[funcName] = methodName.task ? 'Yes' : 'No';
  });
}

function readMDFile(filename, functionList) {
  // Reading in the .md file and creating an array with each line as an element.
  const mdFile = fs.readFileSync(filename, 'utf-8');
  const fileSplit = mdFile.split('\n');
  // Storing the data that should added later to the updated data.
  const linesToAddLater = [];
  let index = fileSplit.length - 1;

  // Removing all the blank lines at the end of the file.
  if (fileSplit[index] === '') {
    while (fileSplit[index] === '') {
      linesToAddLater.push(fileSplit.pop());
      index -= 1;
    }
  }

  // Checking if the last 2 lines are <br> and </table>. If not, the file is corrupted and the
  // data at the end of the file should be fixed.
  if (fileSplit[index] === '<br>' || fileSplit[index - 1] === '</table>') {
    // Storing <br> and </table> to add later.
    linesToAddLater.push(fileSplit.pop());
    linesToAddLater.push(fileSplit.pop());
    index -= 2;
  } else {
    console.log('The file has bad content at the end.');
    return;
  }
  // if (fileSplit[index] !== '<br>' && fileSplit[index - 1] !== '</table>') {
  //   console.log('The file has bad content at the end.');
  //   return;
  // } else {
  //   // Storing <br> and </table> to add later.
  //   linesToAddLater.push(fileSplit.pop());
  //   linesToAddLater.push(fileSplit.pop());
  //   index -= 2;
  // }

  // Removing all the lines until the header tags are reached.
  while (!fileSplit[index].includes('<th')) {
    fileSplit.pop();
    index -= 1;
  }
  // Adding </tr> for the header row, because it got removed in the above loop.
  fileSplit.push('  </tr>');

  // Creating the tags for each method to be appended to the file.
  const tdBeginTag = '    <td style="padding:15px">';
  const tdEndTag = '</td>';

  functionList.forEach((func) => {
    const signCommand = `${tdBeginTag}${func.method_signature}${tdEndTag}`;
    const descCommand = `${tdBeginTag}${func.description}${tdEndTag}`;
    const pathCommand = `${tdBeginTag}${func.path}${tdEndTag}`;
    const workflowCommand = `${tdBeginTag}${func.workflow}${tdEndTag}`;
    fileSplit.push('  <tr>');
    fileSplit.push(signCommand);
    fileSplit.push(descCommand);
    fileSplit.push(pathCommand);
    fileSplit.push(workflowCommand);
    fileSplit.push('  </tr>');
  });

  // Adding </table> and <br> at the end of the file to complete the table and the file.
  while (linesToAddLater.length > 0) {
    fileSplit.push(linesToAddLater.pop());
  }

  // Writing all the content back into the file.
  fs.writeFileSync(filename, fileSplit.join('\n'), {
    encoding: 'utf-8',
    flag: 'w'
  });
}

function getFileInfo() {
  // If files don't exist:
  if (!fs.existsSync(`${adaptdir}/adapter.js`)) {
    console.log('Missing - utils/adapter.js');
    return;
  }
  if (!fs.existsSync(`${adaptdir}/pronghorn.json`)) {
    console.log('Missing - pronghorn.json');
    return;
  }
  if (!fs.existsSync(`${adaptdir}/CALLS.md`)) {
    console.log('Missing - CALLS.md');
    return;
  }

  const descriptionObj = {};
  const workflowObj = {};

  // Get the method descriptions and the workflow values from pronghorn.json file.
  readJSONFile(`${adaptdir}/pronghorn.json`, descriptionObj, workflowObj);

  // Get the method signature, entity path and create an object that contains all the info regarding
  // the method and push it to the functionList array.
  const functionList = [];
  readFileUsingLib(
    `${adaptdir}/adapter.js`,
    descriptionObj,
    workflowObj,
    functionList
  );

  // createMarkDown(functionList);
  readMDFile(`${adaptdir}/CALLS.md`, functionList);
}

getFileInfo();
