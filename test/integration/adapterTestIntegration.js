/* @copyright Itential, LLC 2019 (pre-modifications) */

// Set globals
/* global describe it log pronghornProps */
/* eslint no-unused-vars: warn */
/* eslint no-underscore-dangle: warn  */
/* eslint import/no-dynamic-require:warn */

// include required items for testing & logging
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const util = require('util');
const mocha = require('mocha');
const winston = require('winston');
const { expect } = require('chai');
const { use } = require('chai');
const td = require('testdouble');

const anything = td.matchers.anything();

// stub and attemptTimeout are used throughout the code so set them here
let logLevel = 'none';
const isRapidFail = false;
const isSaveMockData = false;

// read in the properties from the sampleProperties files
let adaptdir = __dirname;
if (adaptdir.endsWith('/test/integration')) {
  adaptdir = adaptdir.substring(0, adaptdir.length - 17);
} else if (adaptdir.endsWith('/test/unit')) {
  adaptdir = adaptdir.substring(0, adaptdir.length - 10);
}
const samProps = require(`${adaptdir}/sampleProperties.json`).properties;

// these variables can be changed to run in integrated mode so easier to set them here
// always check these in with bogus data!!!
samProps.stub = true;
samProps.host = 'replace.hostorip.here';
samProps.authentication.username = 'username';
samProps.authentication.password = 'password';
samProps.protocol = 'http';
samProps.port = 80;
samProps.ssl.enabled = false;
samProps.ssl.accept_invalid_cert = false;
if (samProps.request.attempt_timeout < 30000) {
  samProps.request.attempt_timeout = 30000;
}
const attemptTimeout = samProps.request.attempt_timeout;
const { stub } = samProps;

// these are the adapter properties. You generally should not need to alter
// any of these after they are initially set up
global.pronghornProps = {
  pathProps: {
    encrypted: false
  },
  adapterProps: {
    adapters: [{
      id: 'Test-servicenow',
      type: 'Servicenow',
      properties: samProps
    }]
  }
};

global.$HOME = `${__dirname}/../..`;

// set the log levels that Pronghorn uses, spam and trace are not defaulted in so without
// this you may error on log.trace calls.
const myCustomLevels = {
  levels: {
    spam: 6,
    trace: 5,
    debug: 4,
    info: 3,
    warn: 2,
    error: 1,
    none: 0
  }
};

// need to see if there is a log level passed in
process.argv.forEach((val) => {
  // is there a log level defined to be passed in?
  if (val.indexOf('--LOG') === 0) {
    // get the desired log level
    const inputVal = val.split('=')[1];

    // validate the log level is supported, if so set it
    if (Object.hasOwnProperty.call(myCustomLevels.levels, inputVal)) {
      logLevel = inputVal;
    }
  }
});

// need to set global logging
global.log = winston.createLogger({
  level: logLevel,
  levels: myCustomLevels.levels,
  transports: [
    new winston.transports.Console()
  ]
});

/**
 * Runs the common asserts for test
 */
function runCommonAsserts(data, error) {
  assert.equal(undefined, error);
  assert.notEqual(undefined, data);
  assert.notEqual(null, data);
  assert.notEqual(undefined, data.response);
  assert.notEqual(null, data.response);
}

/**
 * Runs the error asserts for the test
 */
function runErrorAsserts(data, error, code, origin, displayStr) {
  assert.equal(null, data);
  assert.notEqual(undefined, error);
  assert.notEqual(null, error);
  assert.notEqual(undefined, error.IAPerror);
  assert.notEqual(null, error.IAPerror);
  assert.notEqual(undefined, error.IAPerror.displayString);
  assert.notEqual(null, error.IAPerror.displayString);
  assert.equal(code, error.icode);
  assert.equal(origin, error.IAPerror.origin);
  assert.equal(displayStr, error.IAPerror.displayString);
}

/**
 * @function saveMockData
 * Attempts to take data from responses and place them in MockDataFiles to help create Mockdata.
 * Note, this was built based on entity file structure for Adapter-Engine 1.6.x
 * @param {string} entityName - Name of the entity saving mock data for
 * @param {string} actionName -  Name of the action saving mock data for
 * @param {string} descriptor -  Something to describe this test (used as a type)
 * @param {string or object} responseData - The data to put in the mock file.
 */
function saveMockData(entityName, actionName, descriptor, responseData) {
  // do not need to save mockdata if we are running in stub mode (already has mock data) or if told not to save
  if (stub || !isSaveMockData) {
    return false;
  }

  // must have a response in order to store the response
  if (responseData && responseData.response) {
    let data = responseData.response;

    // if there was a raw response that one is better as it is untranslated
    if (responseData.raw) {
      data = responseData.raw;

      try {
        const temp = JSON.parse(data);
        data = temp;
      } catch (pex) {
        // do not care if it did not parse as we will just use data
      }
    }

    try {
      const base = path.join(__dirname, `../../entities/${entityName}/`);
      const mockdatafolder = 'mockdatafiles';
      const filename = `mockdatafiles/${actionName}-${descriptor}.json`;

      if (!fs.existsSync(base + mockdatafolder)) {
        fs.mkdirSync(base + mockdatafolder);
      }

      // write the data we retrieved
      fs.writeFile(base + filename, JSON.stringify(data, null, 2), 'utf8', (errWritingMock) => {
        if (errWritingMock) throw errWritingMock;

        // update the action file to reflect the changes. Note: We're replacing the default object for now!
        fs.readFile(`${base}action.json`, (errRead, content) => {
          if (errRead) throw errRead;

          // parse the action file into JSON
          const parsedJson = JSON.parse(content);

          // The object update we'll write in.
          const responseObj = {
            type: descriptor,
            key: '',
            mockFile: filename
          };

          // get the object for method we're trying to change.
          const currentMethodAction = parsedJson.actions.find((obj) => obj.name === actionName);

          // if the method was not found - should never happen but...
          if (!currentMethodAction) {
            throw Error('Can\'t find an action for this method in the provided entity.');
          }

          // if there is a response object, we want to replace the Response object. Otherwise we'll create one.
          const actionResponseObj = currentMethodAction.responseObjects.find((obj) => obj.type === descriptor);

          // Add the action responseObj back into the array of response objects.
          if (!actionResponseObj) {
            // if there is a default response object, we want to get the key.
            const defaultResponseObj = currentMethodAction.responseObjects.find((obj) => obj.type === 'default');

            // save the default key into the new response object
            if (defaultResponseObj) {
              responseObj.key = defaultResponseObj.key;
            }

            // save the new response object
            currentMethodAction.responseObjects = [responseObj];
          } else {
            // update the location of the mock data file
            actionResponseObj.mockFile = responseObj.mockFile;
          }

          // Save results
          fs.writeFile(`${base}action.json`, JSON.stringify(parsedJson, null, 2), (err) => {
            if (err) throw err;
          });
        });
      });
    } catch (e) {
      log.debug(`Failed to save mock data for ${actionName}. ${e.message}`);
      return false;
    }
  }

  // no response to save
  log.debug(`No data passed to save into mockdata for ${actionName}`);
  return false;
}

// require the adapter that we are going to be using
const Servicenow = require('../../adapter');

// begin the testing - these should be pretty well defined between the describe and the it!
describe('[integration] Servicenow Adapter Test', () => {
  describe('Servicenow Class Tests', () => {
    const a = new Servicenow(
      pronghornProps.adapterProps.adapters[0].id,
      pronghornProps.adapterProps.adapters[0].properties
    );

    if (isRapidFail) {
      const state = {};
      state.passed = true;

      mocha.afterEach(function x() {
        state.passed = state.passed
        && (this.currentTest.state === 'passed');
      });
      mocha.beforeEach(function x() {
        if (!state.passed) {
          return this.currentTest.skip();
        }
        return true;
      });
    }

    describe('#class instance created', () => {
      it('should be a class with properties', (done) => {
        try {
          assert.notEqual(null, a);
          assert.notEqual(undefined, a);
          const checkId = global.pronghornProps.adapterProps.adapters[0].id;
          assert.equal(checkId, a.id);
          assert.notEqual(null, a.allProps);
          const check = global.pronghornProps.adapterProps.adapters[0].properties.healthcheck.type;
          assert.equal(check, a.healthcheckType);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#connect', () => {
      it('should get connected - no healthcheck', (done) => {
        try {
          a.healthcheckType = 'none';
          a.connect();

          try {
            assert.equal(true, a.alive);
            done();
          } catch (error) {
            log.error(`Test Failure: ${error}`);
            done(error);
          }
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      });
      it('should get connected - startup healthcheck', (done) => {
        try {
          a.healthcheckType = 'startup';
          a.connect();

          try {
            assert.equal(true, a.alive);
            done();
          } catch (error) {
            log.error(`Test Failure: ${error}`);
            done(error);
          }
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      });
    });

    describe('#healthCheck', () => {
      it('should be healthy', (done) => {
        try {
          a.healthCheck(null, (data) => {
            try {
              assert.equal(true, a.healthy);
              saveMockData('system', 'healthcheck', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    // broker tests
    describe('#getDevicesFiltered - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          const opts = {
            filter: {
              name: 'deviceName'
            }
          };
          a.getDevicesFiltered(opts, (data, error) => {
            try {
              if (stub) {
                if (samProps.devicebroker.getDevicesFiltered[0].handleFailure === 'ignore') {
                  assert.equal(null, error);
                  assert.notEqual(undefined, data);
                  assert.notEqual(null, data);
                  assert.equal(0, data.total);
                  assert.equal(0, data.list.length);
                } else {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-servicenow-connectorRest-handleEndResponse', displayE);
                }
              } else {
                runCommonAsserts(data, error);
              }
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#iapGetDeviceCount - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          const opts = {
            filter: {
              name: 'deviceName'
            }
          };
          a.iapGetDeviceCount((data, error) => {
            try {
              if (stub) {
                if (samProps.devicebroker.getDevicesFiltered[0].handleFailure === 'ignore') {
                  assert.equal(null, error);
                  assert.notEqual(undefined, data);
                  assert.notEqual(null, data);
                  assert.equal(0, data.count);
                } else {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-servicenow-connectorRest-handleEndResponse', displayE);
                }
              } else {
                runCommonAsserts(data, error);
              }
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    // exposed cache tests
    describe('#iapPopulateEntityCache - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.iapPopulateEntityCache('Device', (data, error) => {
            try {
              if (stub) {
                assert.equal(null, data);
                assert.notEqual(undefined, error);
                assert.notEqual(null, error);
                done();
              } else {
                assert.equal(undefined, error);
                assert.equal('success', data[0]);
                done();
              }
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#iapRetrieveEntitiesCache - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.iapRetrieveEntitiesCache('Device', {}, (data, error) => {
            try {
              if (stub) {
                assert.equal(null, data);
                assert.notEqual(null, error);
                assert.notEqual(undefined, error);
              } else {
                assert.equal(undefined, error);
                assert.notEqual(null, data);
                assert.notEqual(undefined, data);
              }
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });
    /*
    -----------------------------------------------------------------------
    -----------------------------------------------------------------------
    *** All code above this comment will be replaced during a migration ***
    ******************* DO NOT REMOVE THIS COMMENT BLOCK ******************
    -----------------------------------------------------------------------
    -----------------------------------------------------------------------
    */

    const tableTableName = 'incident';
    let tableId = '03dbb48fdb040010a704fe1b6896191b';
    const tableCreateRecordInTableBodyParam = { summary: 'Create Table Record' };
    const tableUpdateTableRecordBodyParam = { summary: 'Updated Table Record' };

    describe('#createRecordInTable - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.createRecordInTable(tableTableName, tableCreateRecordInTableBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(tableId, data.response.id);
              } else {
                runCommonAsserts(data, error);
              }
              tableId = data.response.id;
              saveMockData('Table', 'createRecordInTable', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#queryTableByName - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.queryTableByName(tableTableName, null, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('Table', 'queryTableByName', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#queryTableByNameWithLimit - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.queryTableByNameWithLimit(tableTableName, null, null, null, null, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('Table', 'queryTableByNameWithLimit', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#updateTableRecord - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.updateTableRecord(tableTableName, tableId, tableUpdateTableRecordBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              } else {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              }
              saveMockData('Table', 'updateTableRecord', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#queryTableByNameAndId - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.queryTableByNameAndId(tableTableName, tableId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(tableId, data.response.id);
              } else {
                runCommonAsserts(data, error);
                assert.equal(tableId, data.response.id);
              }
              saveMockData('Table', 'queryTableByNameAndId', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteTableRecord - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteTableRecord(tableTableName, tableId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              } else {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              }
              saveMockData('Table', 'deleteTableRecord', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    let emergencyChangeId = '3fb18d43db440010a704fe1b6896192e';

    describe('#createEmergencyChangeRequest - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.createEmergencyChangeRequest(null, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(emergencyChangeId, data.response.id.value);
              } else {
                runCommonAsserts(data, error);
              }
              emergencyChangeId = data.response.id.value;
              saveMockData('ChangeManagement', 'createEmergencyChangeRequest', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getEmergencyChangeRequest - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getEmergencyChangeRequest(null, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ChangeManagement', 'getEmergencyChangeRequest', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getEmergencyChangeRequestById - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getEmergencyChangeRequestById(null, emergencyChangeId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(emergencyChangeId, data.response.id.value);
              } else {
                runCommonAsserts(data, error);
                assert.equal(emergencyChangeId, data.response.id.value);
              }
              saveMockData('ChangeManagement', 'getEmergencyChangeRequestById', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteEmergencyChangeRequestById - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteEmergencyChangeRequestById(null, emergencyChangeId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              } else {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              }
              saveMockData('ChangeManagement', 'deleteEmergencyChangeRequestById', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    let normalChangeId = '51cff803db440010a704fe1b68961946';
    const normalChangeParam = {
      start_date: '2019-11-01T22:30:00Z',
      end_date: '2019-11-01T23:59:00Z',
      cmdb_ci: '82992eb60ad337024fbb6d06a866c636'
    };
    describe('#createNormalChangeRequest - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.createNormalChangeRequest(normalChangeParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(normalChangeId, data.response.id.value);
              } else {
                runCommonAsserts(data, error);
              }
              normalChangeId = data.response.id.value;
              saveMockData('ChangeManagement', 'createNormalChangeRequest', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getNormalChangeRequest - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getNormalChangeRequest(null, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ChangeManagement', 'getNormalChangeRequest', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getNormalChangeRequestById - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getNormalChangeRequestById(null, normalChangeId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(normalChangeId, data.response.id.value);
              } else {
                runCommonAsserts(data, error);
                assert.equal(normalChangeId, data.response.id.value);
              }
              saveMockData('ChangeManagement', 'getNormalChangeRequestById', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    let changeManagementTaskId = 'dea0a107db840010a704fe1b68961909';

    describe('#createChangeRequestTask - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.createChangeRequestTask(null, normalChangeId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(changeManagementTaskId, data.response.id.value);
              } else {
                runCommonAsserts(data, error);
              }
              changeManagementTaskId = data.response.id.value;
              saveMockData('ChangeManagement', 'createChangeRequestTask', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getChangeRequestTask - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getChangeRequestTask(null, normalChangeId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ChangeManagement', 'getChangeRequestTask', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getChangeTaskByTaskId - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getChangeTaskByTaskId(null, normalChangeId, changeManagementTaskId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(changeManagementTaskId, data.response.id.value);
              } else {
                runCommonAsserts(data, error);
                assert.equal(changeManagementTaskId, data.response.id.value);
              }
              saveMockData('ChangeManagement', 'getChangeTaskByTaskId', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteChangeTaskByTaskId - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteChangeTaskByTaskId(null, normalChangeId, changeManagementTaskId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              } else {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              }
              saveMockData('ChangeManagement', 'deleteChangeTaskByTaskId', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createChangeRequestConflict - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.createChangeRequestConflict(null, normalChangeId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ChangeManagement', 'createChangeRequestConflict', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getChangeRequestConflict - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getChangeRequestConflict(null, normalChangeId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ChangeManagement', 'getChangeRequestConflict', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteNormalChangeRequestById - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteNormalChangeRequestById(null, normalChangeId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              } else {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              }
              saveMockData('ChangeManagement', 'deleteNormalChangeRequestById', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    let changeManagementStandardChangeTemplateId = '508e02ec47410200e90d87e8dee49058';

    describe('#getStandardChangeTemplate - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getStandardChangeTemplate(null, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              changeManagementStandardChangeTemplateId = data.response[0].id.value;
              saveMockData('ChangeManagement', 'getStandardChangeTemplate', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getStandardChangeTemplateById - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getStandardChangeTemplateById(null, changeManagementStandardChangeTemplateId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(changeManagementStandardChangeTemplateId, data.response.id.value);
              } else {
                runCommonAsserts(data, error);
                assert.equal(changeManagementStandardChangeTemplateId, data.response.id.value);
              }
              saveMockData('ChangeManagement', 'getStandardChangeTemplateById', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#changeStandardTemplateById - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.changeStandardTemplateById(changeManagementStandardChangeTemplateId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              } else {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              }
              saveMockData('ChangeManagement', 'changeStandardTemplateById', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    let changeManagementStandardChangeId = '508e02ec47410200e90d87e8dee49058';

    describe('#getStandardChangeRequest - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getStandardChangeRequest(null, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              changeManagementStandardChangeId = data.response[0].id.value;
              saveMockData('ChangeManagement', 'getStandardChangeRequest', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getStandardChangeRequestById - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getStandardChangeRequestById(null, changeManagementStandardChangeId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(changeManagementStandardChangeId, data.response.id.value);
              } else {
                runCommonAsserts(data, error);
                assert.equal(changeManagementStandardChangeId, data.response.id.value);
              }
              saveMockData('ChangeManagement', 'getStandardChangeRequestById', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteStandardChangeRequestById - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteStandardChangeRequestById(null, changeManagementStandardChangeId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              } else {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              }
              saveMockData('ChangeManagement', 'deleteStandardChangeRequestById', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    let applicationServiceId = 'b20761cbdb040010a704fe1b68961985';
    const applicationServiceCreateApplicationBodyParam = {};

    describe('#createApplication - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.createApplication(applicationServiceCreateApplicationBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                const tindex = data.response.url.lastIndexOf('/');
                assert.equal(applicationServiceId, data.response.url.substring(tindex + 1));
              } else {
                runCommonAsserts(data, error);
              }
              const lindex = data.response.url.lastIndexOf('/');
              applicationServiceId = data.response.url.substring(lindex + 1);
              saveMockData('ApplicationService', 'createApplication', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getApplicationById - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getApplicationById(applicationServiceId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                const tindex = data.response.service.url.lastIndexOf('/');
                assert.equal(applicationServiceId, data.response.service.url.substring(tindex + 1));
              } else {
                runCommonAsserts(data, error);
                const tindex = data.response.service.url.lastIndexOf('/');
                assert.equal(applicationServiceId, data.response.service.url.substring(tindex + 1));
              }
              saveMockData('ApplicationService', 'getApplicationById', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const aggregateTableQuery = { active: true };
    const aggregateTableAggregate = { sysparm_count: true };
    const aggregateTableName = 'incident';

    describe('#getAggregate - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getAggregate(aggregateTableQuery, aggregateTableName, aggregateTableAggregate, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('Aggregate', 'getAggregate', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const performanceAnalyticsSysparmUuid = 'fakedata';

    describe('#getPerformanceAnalytics - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getPerformanceAnalytics(performanceAnalyticsSysparmUuid, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('PerformanceAnalytics', 'getPerformanceAnalytics', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const randExt = `${Math.random()}`;
    const changeRequestsCreateChangeRequestBodyParam = { summary: 'This is a test case change item' };
    let changeRequestsId = 'c83c5e5347c12200e0ef563dbb9a7190';
    const changeRequestsUpdateChangeRequestBodyParam = { summary: 'This is an updated change item by id' };

    describe('#createChangeRequest - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.createChangeRequest(changeRequestsCreateChangeRequestBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(changeRequestsId, data.response.id);
              } else {
                runCommonAsserts(data, error);
              }
              changeRequestsId = data.response.id;
              saveMockData('ChangeRequests', 'createChangeRequest', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getChangeRequests - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getChangeRequests(null, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.notEqual(0, data.response.length);
                assert.equal(changeRequestsId, data.response[0].id);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ChangeRequests', 'getChangeRequests', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#updateChangeRequest - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.updateChangeRequest(changeRequestsId, changeRequestsUpdateChangeRequestBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              } else {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              }
              saveMockData('ChangeRequests', 'updateChangeRequest', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getChangeRequestById - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getChangeRequestById(changeRequestsId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(changeRequestsId, data.response.id);
              } else {
                runCommonAsserts(data, error);
                assert.equal(changeRequestsId, data.response.id);
              }
              saveMockData('ChangeRequests', 'getChangeRequestById', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteChangeRequest - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteChangeRequest(changeRequestsId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              } else {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              }
              saveMockData('ChangeRequests', 'deleteChangeRequest', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const incidentsCreateIncidentBodyParam = { summary: 'This is a test case incident item' };
    let incidentsId = '46e2fee9a9fe19810049b49dee0daf58';
    const incidentsUpdateIncidentBodyParam = { summary: 'This is an updated incident item by id' };

    describe('#createIncident - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.createIncident(incidentsCreateIncidentBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(incidentsId, data.response.id);
              } else {
                runCommonAsserts(data, error);
              }
              incidentsId = data.response.id;
              saveMockData('Incidents', 'createIncident', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getIncidents - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getIncidents(null, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.notEqual(0, data.response.length);
                assert.equal(incidentsId, data.response[0].id);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('Incidents', 'getIncidents', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#updateIncident - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.updateIncident(incidentsId, incidentsUpdateIncidentBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              } else {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              }
              saveMockData('Incidents', 'updateIncident', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    // REQUIRES PLUGIN ACTIVATION - OR THIS TEST WILL FAIL
    describe('#getMajorIncident - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getMajorIncident(incidentsId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('MajorIncidentManagement', 'getMajorIncident', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              log.error('Make sure you have the Major Incident plugin installed in ServiceNow!');
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getIncidentById - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getIncidentById(incidentsId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(incidentsId, data.response.id);
              } else {
                runCommonAsserts(data, error);
                assert.equal(incidentsId, data.response.id);
              }
              saveMockData('Incidents', 'getIncidentById', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const attachmentFileName = 'Test_Data';
    const attachmentTableName = 'incident';
    const attachmentBodyFormData = { Data: 'dsfdsf', MoreData: 'asdsad' };
    let attachmentId = '173a9c17db4c0010a704fe1b6896195b';

    describe('#uploadAttachment - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.uploadAttachment(null, attachmentFileName, attachmentTableName, incidentsId, attachmentBodyFormData, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(attachmentId, data.response.id);
              } else {
                runCommonAsserts(data, error);
              }
              attachmentId = data.response.id;
              saveMockData('Attachment', 'uploadAttachment', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getAttachmentsMetadata - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getAttachmentsMetadata(null, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('Attachment', 'getAttachmentsMetadata', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getAttachmentMetadataById - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getAttachmentMetadataById(attachmentId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(attachmentId, data.response.id);
              } else {
                runCommonAsserts(data, error);
                assert.equal(attachmentId, data.response.id);
              }
              saveMockData('Attachment', 'getAttachmentMetadataById', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getAttachmentBinaryById - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getAttachmentBinaryById(attachmentId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('Attachment', 'getAttachmentBinaryById', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteAttachmentById - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteAttachmentById(attachmentId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              } else {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              }
              saveMockData('Attachment', 'deleteAttachmentById', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteIncident - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteIncident(incidentsId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              } else {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              }
              saveMockData('Incidents', 'deleteIncident', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const groupsCreateGroupBodyParam = {
      name: `IAP${randExt}`,
      description: 'Test Group'
    };
    let groupsId = '1c590685c0a8018b2a473a7159ff5d9a';
    const groupsUpdateGroupBodyParam = { description: 'Updated Test Group' };

    describe('#createGroup - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.createGroup(groupsCreateGroupBodyParam, (data, error) => {
            try {
              runCommonAsserts(data, error);
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(groupsId, data.response.id);
              } else {
                runCommonAsserts(data, error);
              }
              groupsId = data.response.id;
              saveMockData('Groups', 'createGroup', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getGroups - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getGroups(null, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.notEqual(0, data.response.length);
                assert.equal(groupsId, data.response[0].id);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('Groups', 'getGroups', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#updateGroup - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.updateGroup(groupsId, groupsUpdateGroupBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              } else {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              }
              saveMockData('Groups', 'updateGroup', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getGroupById - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getGroupById(groupsId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(groupsId, data.response.id);
              } else {
                runCommonAsserts(data, error);
                assert.equal(groupsId, data.response.id);
              }
              saveMockData('Groups', 'getGroupById', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteGroup - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteGroup(groupsId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              } else {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              }
              saveMockData('Groups', 'deleteGroup', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const configItemsCreateConfigItemBodyParam = {
      name: `IAP${randExt}`,
      summary: 'This is a test case config item'
    };
    let configItemsId = '00a96c0d3790200044e0bfc8bcbe5db4';
    const configItemsUpdateConfigItemBodyParam = { summary: 'This is an updated config item by id' };

    describe('#createConfigItem - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.createConfigItem(configItemsCreateConfigItemBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(configItemsId, data.response.id);
              } else {
                runCommonAsserts(data, error);
              }
              configItemsId = data.response.id;
              saveMockData('ConfigItems', 'createConfigItem', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getConfigItems - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getConfigItems(null, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.notEqual(0, data.response.length);
                assert.equal(configItemsId, data.response[0].id);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ConfigItems', 'getConfigItems', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#updateConfigItem - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.updateConfigItem(configItemsId, configItemsUpdateConfigItemBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              } else {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              }
              saveMockData('ConfigItems', 'updateConfigItem', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getConfigItemById - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getConfigItemById(configItemsId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(configItemsId, data.response.id);
              } else {
                runCommonAsserts(data, error);
                assert.equal(configItemsId, data.response.id);
              }
              saveMockData('ConfigItems', 'getConfigItemById', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteConfigItem - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteConfigItem(configItemsId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              } else {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              }
              saveMockData('ConfigItems', 'deleteConfigItem', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const knowledgeArticlesCreateArticleBodyParam = { summary: 'This is a test case article' };
    let knowledgeArticlesId = '0b48fd75474321009db4b5b08b9a71c2';
    const knowledgeArticlesUpdateArticleBodyParam = { summary: 'This is an updated article by id' };

    describe('#createArticle - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.createArticle(knowledgeArticlesCreateArticleBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(knowledgeArticlesId, data.response.id);
              } else {
                runCommonAsserts(data, error);
              }
              knowledgeArticlesId = data.response.id;
              saveMockData('KnowledgeArticles', 'createArticle', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getArticles - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getArticles(null, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.notEqual(0, data.response.length);
                assert.equal(knowledgeArticlesId, data.response[0].id);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('KnowledgeArticles', 'getArticles', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#updateArticle - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.updateArticle(knowledgeArticlesId, knowledgeArticlesUpdateArticleBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              } else {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              }
              saveMockData('KnowledgeArticles', 'updateArticle', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getArticleById - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getArticleById(knowledgeArticlesId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(knowledgeArticlesId, data.response.id);
              } else {
                runCommonAsserts(data, error);
                assert.equal(knowledgeArticlesId, data.response.id);
              }
              saveMockData('KnowledgeArticles', 'getArticleById', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteArticle - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteArticle(knowledgeArticlesId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              } else {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              }
              saveMockData('KnowledgeArticles', 'deleteArticle', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const problemsCreateProblemBodyParam = { summary: 'This is a test case problem item' };
    let problemsId = '1998e51967b032004792adab9485effa';
    const problemsUpdateProblemBodyParam = { summary: 'This is an updated problem item by id' };

    describe('#createProblem - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.createProblem(problemsCreateProblemBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(problemsId, data.response.id);
              } else {
                runCommonAsserts(data, error);
              }
              problemsId = data.response.id;
              saveMockData('Problems', 'createProblem', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getProblems - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getProblems(null, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.notEqual(0, data.response.length);
                assert.equal(problemsId, data.response[0].id);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('Problems', 'getProblems', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#updateProblem - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.updateProblem(problemsId, problemsUpdateProblemBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              } else {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              }
              saveMockData('Problems', 'updateProblem', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getProblemById - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getProblemById(problemsId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(problemsId, data.response.id);
              } else {
                runCommonAsserts(data, error);
                assert.equal(problemsId, data.response.id);
              }
              saveMockData('Problems', 'getProblemById', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteProblem - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteProblem(problemsId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              } else {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              }
              saveMockData('Problems', 'deleteProblem', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const requestsCreateRequestsBodyParam = { summary: 'This is a test case request item' };
    let requestsId = '6eed229047801200e0ef563dbb9a71c2';
    const requestsUpdateRequestsBodyParam = { summary: 'This is an updated request item by id' };

    describe('#createRequests - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.createRequests(requestsCreateRequestsBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(requestsId, data.response.id);
              } else {
                runCommonAsserts(data, error);
              }
              requestsId = data.response.id;
              saveMockData('Requests', 'createRequests', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getRequests - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getRequests(null, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.notEqual(0, data.response.length);
                assert.equal(requestsId, data.response[0].id);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('Requests', 'getRequests', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#updateRequests - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.updateRequests(requestsId, requestsUpdateRequestsBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              } else {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              }
              saveMockData('Requests', 'updateRequests', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getRequestsById - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getRequestsById(requestsId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(requestsId, data.response.id);
              } else {
                runCommonAsserts(data, error);
                assert.equal(requestsId, data.response.id);
              }
              saveMockData('Requests', 'getRequestsById', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteRequests - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteRequests(requestsId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              } else {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              }
              saveMockData('Requests', 'deleteRequests', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const requestItemsCreateRequestItemsBodyParam = { summary: 'This is a test case requestItem item' };
    let requestItemsId = 'aeed229047801200e0ef563dbb9a71c2';
    const requestItemsUpdateRequestItemsBodyParam = { summary: 'This is an updated requestItem item by id' };

    describe('#createRequestItems - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.createRequestItems(requestItemsCreateRequestItemsBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(requestItemsId, data.response.id);
              } else {
                runCommonAsserts(data, error);
              }
              requestItemsId = data.response.id;
              saveMockData('RequestItems', 'createRequestItems', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getRequestItems - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getRequestItems(null, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.notEqual(0, data.response.length);
                assert.equal(requestItemsId, data.response[0].id);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('RequestItems', 'getRequestItems', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#updateRequestItems - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.updateRequestItems(requestItemsId, requestItemsUpdateRequestItemsBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              } else {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              }
              saveMockData('RequestItems', 'updateRequestItems', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getRequestItemsById - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getRequestItemsById(requestItemsId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(requestItemsId, data.response.id);
              } else {
                runCommonAsserts(data, error);
                assert.equal(requestItemsId, data.response.id);
              }
              saveMockData('RequestItems', 'getRequestItemsById', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteRequestItems - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteRequestItems(requestItemsId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              } else {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              }
              saveMockData('RequestItems', 'deleteRequestItems', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const usersCreateUsersBodyParam = {
      username: `IAP${randExt}`,
      password: 'metemp'
    };
    let usersId = '02826bf03710200044e0bfc8bcbe5d3f';
    const usersUpdateUsersBodyParam = { name: 'IAP TESTER' };

    describe('#createUsers - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.createUsers(usersCreateUsersBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(usersId, data.response.id);
              } else {
                runCommonAsserts(data, error);
              }
              usersId = data.response.id;
              saveMockData('Users', 'createUsers', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getUsers - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getUsers(null, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.notEqual(0, data.response.length);
                assert.equal(usersId, data.response[0].id);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('Users', 'getUsers', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getUserRoles - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getUserRoles(usersId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UserRoleInheritance', 'getUserRoles', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#updateUsers - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.updateUsers(usersId, usersUpdateUsersBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              } else {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              }
              saveMockData('Users', 'updateUsers', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getUsersById - errors', () => {
      it('should work if integrated or standalone with mockdata', (done) => {
        try {
          a.getUsersById(usersId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(usersId, data.response.id);
              } else {
                runCommonAsserts(data, error);
                assert.equal(usersId, data.response.id);
              }
              saveMockData('Users', 'getUsersById', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getServiceCatalogUserDeliveryAddress - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getServiceCatalogUserDeliveryAddress(usersId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ServiceCatalog', 'getServiceCatalogUserDeliveryAddress', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteUsers - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteUsers(usersId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              } else {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              }
              saveMockData('Users', 'deleteUsers', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const serviceCatalogSysparmLimit = 555;
    let serviceCatalogId = '742ce428d7211100f2d224837e61036d';
    let serviceCategoryId = '803e95e1c3732100fca206e939ba8f2a';
    let serviceCatalogItemId = '011f117a9f3002002920bde8132e7020';
    const serviceCatalogAddItemToCartBodyParam = {
      sysparm_quantity: '1',
      variables: {
        short_description: 'blah',
        std_change_producer: true
      }
    };
    let serviceCatalogCartId = 'd43ba4fedb333300a704fe1b68961985';
    let serviceCatalogCartItemId = 'c026b4d7db8c0010a704fe1b689619da';
    let serviceCatalogCartItemVarId = 'f9637c669f4102002920bde8132e7022';
    const serviceCatalogUpdateItemInCartBodyParam = {
      sysparm_quantity: '2',
      variables: {
        short_description: 'blahblahblah',
        std_change_producer: true
      }
    };
    const serviceCatalogGetServiceCatalogOrderItemsBodyParam = {
      variables: {
        short_description: 'blah',
        std_change_producer: true
      }
    };

    describe('#getServiceCatalogs - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getServiceCatalogs(serviceCatalogSysparmLimit, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(serviceCatalogId, data.response[0].id);
              } else {
                runCommonAsserts(data, error);
              }
              serviceCatalogId = data.response[0].id;
              saveMockData('ServiceCatalog', 'getServiceCatalogs', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getServiceCatalogById - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getServiceCatalogById(serviceCatalogSysparmLimit, serviceCatalogId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(serviceCatalogId, data.response.id);
              } else {
                runCommonAsserts(data, error);
                assert.equal(serviceCatalogId, data.response.id);
              }
              saveMockData('ServiceCatalog', 'getServiceCatalogById', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getServiceCatalogCategoryInformation - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getServiceCatalogCategoryInformation(serviceCatalogSysparmLimit, serviceCatalogId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              serviceCategoryId = data.response[0].id;
              saveMockData('ServiceCatalog', 'getServiceCatalogCategoryInformation', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getServiceCatalogCategories - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getServiceCatalogCategories(serviceCatalogSysparmLimit, serviceCategoryId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ServiceCatalog', 'getServiceCatalogCategories', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getServiceCatalogItems - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getServiceCatalogItems(serviceCatalogSysparmLimit, null, null, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              serviceCatalogItemId = data.response[0].id;
              saveMockData('ServiceCatalog', 'getServiceCatalogItems', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getServiceCatalogItemById - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getServiceCatalogItemById(serviceCatalogSysparmLimit, serviceCatalogItemId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(serviceCatalogItemId, data.response.id);
              } else {
                runCommonAsserts(data, error);
                assert.equal(serviceCatalogItemId, data.response.id);
              }
              serviceCatalogCartItemVarId = data.response.variables[0].id;
              saveMockData('ServiceCatalog', 'getServiceCatalogItemById', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getServiceCatalogOrderItems - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getServiceCatalogOrderItems(serviceCatalogItemId, serviceCatalogGetServiceCatalogOrderItemsBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ServiceCatalog', 'getServiceCatalogOrderItems', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    // NEED TO HAVE AN ITEM THAT CAN BE ORDERED NOW --
    const orderNowId = '7198552237b1300054b6a3549dbe5dea';
    describe('#orderNowServiceCatalog - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.orderNowServiceCatalog(orderNowId, serviceCatalogAddItemToCartBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ServiceCatalog', 'orderNowServiceCatalog', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              log.error('Verify Order Now item id as not all items can be ordered now!');
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#addItemToCart - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.addItemToCart(serviceCatalogItemId, serviceCatalogAddItemToCartBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              serviceCatalogCartItemId = data.response.items[0].cart_item_id;
              saveMockData('ServiceCatalog', 'addItemToCart', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getServiceCatalogCart - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getServiceCatalogCart((data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              serviceCatalogCartId = data.response.cartId;
              saveMockData('ServiceCatalog', 'getServiceCatalogCart', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#updateServiceCatalogCart - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.updateServiceCatalogCart(serviceCatalogCartItemId, serviceCatalogUpdateItemInCartBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              } else {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              }
              saveMockData('ServiceCatalog', 'updateServiceCatalogCart', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getServiceCatalogDisplayVariable - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          const serviceCatalogGetServiceCatalogDisplayVariableBodyParam = { sysparm_value: serviceCatalogCartItemVarId };
          a.getServiceCatalogDisplayVariable(serviceCatalogCartItemId, serviceCatalogGetServiceCatalogDisplayVariableBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ServiceCatalog', 'getServiceCatalogDisplayVariable', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#checkoutCartServiceCatalog - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.checkoutCartServiceCatalog((data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ServiceCatalog', 'checkoutCartServiceCatalog', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#addItemToCart - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.addItemToCart(serviceCatalogItemId, serviceCatalogAddItemToCartBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              serviceCatalogCartItemId = data.response.items[0].cart_item_id;
              saveMockData('ServiceCatalog', 'addItemToCart', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#submitOrderServiceCatalog - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.submitOrderServiceCatalog((data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ServiceCatalog', 'submitOrderServiceCatalog', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#addItemToCart - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.addItemToCart(serviceCatalogItemId, serviceCatalogAddItemToCartBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              serviceCatalogCartItemId = data.response.items[0].cart_item_id;
              saveMockData('ServiceCatalog', 'addItemToCart', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteServiceCatalogCartItems - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteServiceCatalogCartItems(serviceCatalogCartItemId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              } else {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              }
              saveMockData('ServiceCatalog', 'deleteServiceCatalogCartItems', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteServiceCatalogCart - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteServiceCatalogCart(serviceCatalogCartId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              } else {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              }
              saveMockData('ServiceCatalog', 'deleteServiceCatalogCart', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    // NEED TO HAVE A GUIDE THAT CAN BE USED --
    const serviceCatalogCreateServiceCatalogRecordGuideBodyParam = {};
    const guideId = '25110912372211003e7d40ed9dbe5dd6';
    const serviceCatalogGetServiceCatalogCheckoutInformationBodyParam = {};

    describe('#createServiceCatalogRecordGuide - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.createServiceCatalogRecordGuide(guideId, serviceCatalogCreateServiceCatalogRecordGuideBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ServiceCatalog', 'createServiceCatalogRecordGuide', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getServiceCatalogCheckoutInformation - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getServiceCatalogCheckoutInformation(guideId, serviceCatalogGetServiceCatalogCheckoutInformationBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ServiceCatalog', 'getServiceCatalogCheckoutInformation', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    // REQUIRES PLUGIN ACTIVATION - OR THESE (CSM) TESTS WILL FAIL
    const customerServiceManagementSysparmQuery = {
      sysparm_limit: 2,
      sysparm_offset: 0
    };
    const customerServiceManagementCreateCSMConsumerBodyParam = {
      country: 'USA',
      city: 'Atlanta',
      title: 'Director',
      state: 'GA',
      first_name: 'John',
      last_name: 'Doe',
      active: 'true',
      time_zone: 'EST',
      name: `John Doe${Math.random()}`,
      primary: 'false'
    };
    let consumerId = '5efd6fc81bd000103dc38515ec4bcb07';

    describe('#createCSMConsumer - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.createCSMConsumer(customerServiceManagementSysparmQuery, customerServiceManagementCreateCSMConsumerBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              consumerId = data.response.id;
              saveMockData('CustomerServiceManagement', 'createCSMConsumer', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              log.error('Make sure you have the Customer Service Management plugin installed in ServiceNow!');
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#queryCSMConsumers - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.queryCSMConsumers(customerServiceManagementSysparmQuery, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('CustomerServiceManagement', 'queryCSMConsumers', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              log.error('Make sure you have the Customer Service Management plugin installed in ServiceNow!');
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getCSMConsumer - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getCSMConsumer(consumerId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(consumerId, data.response.id);
              } else {
                runCommonAsserts(data, error);
                assert.equal(consumerId, data.response.id);
              }
              saveMockData('CustomerServiceManagement', 'getCSMConsumer', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              log.error('Make sure you have the Customer Service Management plugin installed in ServiceNow!');
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const customerServiceManagementCreateCSMContactBodyParam = {
      country: 'USA',
      city: 'Atlanta',
      title: 'Director',
      state: 'GA',
      first_name: 'John',
      last_name: 'Doe',
      active: 'true',
      time_zone: 'EST',
      name: `John Doe${Math.random()}`,
      primary: 'false'
    };
    let contactId = 'fake';

    describe('#createCSMContact - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.createCSMContact(customerServiceManagementSysparmQuery, customerServiceManagementCreateCSMContactBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              contactId = data.response.id;
              saveMockData('CustomerServiceManagement', 'createCSMContact', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              log.error('Make sure you have the Customer Service Management plugin installed in ServiceNow!');
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#queryCSMContacts - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.queryCSMContacts(customerServiceManagementSysparmQuery, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('CustomerServiceManagement', 'queryCSMContacts', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              log.error('Make sure you have the Customer Service Management plugin installed in ServiceNow!');
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getCSMContact - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getCSMContact(contactId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(contactId, data.response.id);
              } else {
                runCommonAsserts(data, error);
                assert.equal(contactId, data.response.id);
              }
              saveMockData('CustomerServiceManagement', 'getCSMContact', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              log.error('Make sure you have the Customer Service Management plugin installed in ServiceNow!');
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const customerServiceManagementCreateCSMCaseBodyParam = {
      consumer: consumerId,
      short_description: `IAP Case${Math.random()}`
    };
    const customerServiceManagementUpdateCSMCaseBodyParam = {
      priority: '4',
      short_description: `Updated IAP Case${Math.random()}`
    };
    let caseId = 'fake';

    describe('#createCSMCase - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.createCSMCase(customerServiceManagementSysparmQuery, customerServiceManagementCreateCSMCaseBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              caseId = data.response.id;
              saveMockData('CustomerServiceManagement', 'createCSMCase', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              log.error('Make sure you have the Customer Service Management plugin installed in ServiceNow!');
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#queryCSMCases - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.queryCSMCases(customerServiceManagementSysparmQuery, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('CustomerServiceManagement', 'queryCSMCases', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              log.error('Make sure you have the Customer Service Management plugin installed in ServiceNow!');
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#updateCSMCase - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.updateCSMCase(caseId, customerServiceManagementUpdateCSMCaseBodyParam, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              } else {
                runCommonAsserts(data, error);
                assert.equal('success', data.response);
              }
              saveMockData('CustomerServiceManagement', 'updateCSMCase', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              log.error('Make sure you have the Customer Service Management plugin installed in ServiceNow!');
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getCSMCase - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getCSMCase(caseId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(caseId, data.response.id);
              } else {
                runCommonAsserts(data, error);
                assert.equal(caseId, data.response.id);
              }
              saveMockData('CustomerServiceManagement', 'getCSMCase', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              log.error('Make sure you have the Customer Service Management plugin installed in ServiceNow!');
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    let accountId = '552100981b5400103dc38515ec4bcb33';

    describe('#queryCSMAccounts - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.queryCSMAccounts(customerServiceManagementSysparmQuery, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
              } else {
                runCommonAsserts(data, error);
              }
              accountId = data.response[0].id;
              saveMockData('CustomerServiceManagement', 'queryCSMAccounts', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              log.error('Make sure you have the Customer Service Management plugin installed in ServiceNow!');
              log.error('Also need to make sure that an account exists!');
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getCSMAccount - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getCSMAccount(accountId, (data, error) => {
            try {
              if (stub) {
                runCommonAsserts(data, error);
                assert.equal(accountId, data.response.id);
              } else {
                runCommonAsserts(data, error);
                assert.equal(accountId, data.response.id);
              }
              saveMockData('CustomerServiceManagement', 'getCSMAccount', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              log.error('Make sure you have the Customer Service Management plugin installed in ServiceNow!');
              log.error('Also need to make sure that an account exists!');
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    if (stub) {
      const agentPresenceId = 'fakedata';
      const agentPresenceSetAgentPresenceBodyParam = {};

      describe('#setAgentPresence - errors', () => {
        it('should work if integrated but since no mockdata should error when run standalone', (done) => {
          try {
            a.setAgentPresence(agentPresenceId, agentPresenceSetAgentPresenceBodyParam, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-servicenow-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('AgentPresence', 'setAgentPresence', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        }).timeout(attemptTimeout);
      });

      describe('#getAgentPresence - errors', () => {
        it('should work if integrated but since no mockdata should error when run standalone', (done) => {
          try {
            a.getAgentPresence(agentPresenceId, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-servicenow-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('AgentPresence', 'setAgentPresence', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        }).timeout(attemptTimeout);
      });

      const importSetTableName = 'incident';
      let importSetId = 'fakedata';
      const importSetImportIntoTableBodyParam = {};
      describe('#importIntoTable - errors', () => {
        it('should work if integrated but since no mockdata should error when run standalone', (done) => {
          try {
            a.importIntoTable(importSetTableName, importSetImportIntoTableBodyParam, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-servicenow-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                  importSetId = data.response.id;
                }
                saveMockData('ImportSet', 'importIntoTable', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        }).timeout(attemptTimeout);
      });

      describe('#getImportById - errors', () => {
        it('should work if integrated but since no mockdata should error when run standalone', (done) => {
          try {
            a.getImportById(importSetTableName, importSetId, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-servicenow-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('ImportSet', 'getImportById', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        }).timeout(attemptTimeout);
      });

      const emailCreateEmailBodyParam = {};
      let emailId = 'fakedata';

      describe('#createEmail - errors', () => {
        it('should work if integrated but since no mockdata should error when run standalone', (done) => {
          try {
            a.createEmail(emailCreateEmailBodyParam, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-servicenow-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                  emailId = data.response.id;
                }
                saveMockData('Email', 'createEmail', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        }).timeout(attemptTimeout);
      });

      describe('#getEmail - errors', () => {
        it('should work if integrated but since no mockdata should error when run standalone', (done) => {
          try {
            a.getEmail(emailId, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-servicenow-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('Email', 'getEmail', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        }).timeout(attemptTimeout);
      });

      const pushInstallationPushApplicationName = 'fakedata';
      const pushInstallationRemoveInstallationBodyParam = {};
      describe('#removeInstallation - errors', () => {
        it('should work if integrated but since no mockdata should error when run standalone', (done) => {
          try {
            a.removeInstallation(pushInstallationPushApplicationName, pushInstallationRemoveInstallationBodyParam, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-servicenow-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('PushInstallation', 'removeInstallation', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        }).timeout(attemptTimeout);
      });

      const pushInstallationPushInstallationBodyParam = {};
      describe('#pushInstallation - errors', () => {
        it('should work if integrated but since no mockdata should error when run standalone', (done) => {
          try {
            a.pushInstallation(pushInstallationPushApplicationName, pushInstallationPushInstallationBodyParam, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-servicenow-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('PushInstallation', 'pushInstallation', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        }).timeout(attemptTimeout);
      });

      const queueId = 'fakedata';
      const queueCreateQueueBodyParam = {};
      describe('#createQueue - errors', () => {
        it('should work if integrated but since no mockdata should error when run standalone', (done) => {
          try {
            a.createQueue(queueId, queueCreateQueueBodyParam, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-servicenow-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('Queue', 'createQueue', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        }).timeout(attemptTimeout);
      });

      const taskCommunicationManagementSysparmTable = 'fakedata';
      const taskCommunicationManagementCreateCommunicationPlanBodyParam = {};
      describe('#createCommunicationPlan - errors', () => {
        it('should work if integrated but since no mockdata should error when run standalone', (done) => {
          try {
            a.createCommunicationPlan(taskCommunicationManagementSysparmTable, taskCommunicationManagementCreateCommunicationPlanBodyParam, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-servicenow-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('TaskCommunicationManagement', 'createCommunicationPlan', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        }).timeout(attemptTimeout);
      });

      const taskCommunicationManagementCreateCommunicationTaskBodyParam = {};
      describe('#createCommunicationTask - errors', () => {
        it('should work if integrated but since no mockdata should error when run standalone', (done) => {
          try {
            a.createCommunicationTask(taskCommunicationManagementSysparmTable, taskCommunicationManagementCreateCommunicationTaskBodyParam, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-servicenow-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('TaskCommunicationManagement', 'createCommunicationTask', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        }).timeout(attemptTimeout);
      });

      const taskCommunicationManagementCommPlanId = 'fakedata';
      const taskCommunicationManagementManageCommunicationRecipientsBodyParam = {};
      describe('#manageCommunicationRecipients - errors', () => {
        it('should work if integrated but since no mockdata should error when run standalone', (done) => {
          try {
            a.manageCommunicationRecipients(taskCommunicationManagementSysparmTable, taskCommunicationManagementCommPlanId, taskCommunicationManagementManageCommunicationRecipientsBodyParam, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-servicenow-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('TaskCommunicationManagement', 'manageCommunicationRecipients', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        }).timeout(attemptTimeout);
      });

      const taskCommunicationManagementCommTaskId = 'fakedata';
      const taskCommunicationManagementTable = 'fakedata';
      const taskCommunicationManagementGetCommunicationTaskStateBodyParam = {};
      describe('#getCommunicationTaskState - errors', () => {
        it('should work if integrated but since no mockdata should error when run standalone', (done) => {
          try {
            a.getCommunicationTaskState(taskCommunicationManagementCommTaskId, taskCommunicationManagementTable, taskCommunicationManagementGetCommunicationTaskStateBodyParam, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-servicenow-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('TaskCommunicationManagement', 'getCommunicationTaskState', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        }).timeout(attemptTimeout);
      });

      const taskCommunicationManagementUpdateCommunicationTaskBodyParam = {};
      describe('#updateCommunicationTask - errors', () => {
        it('should work if integrated but since no mockdata should error when run standalone', (done) => {
          try {
            a.updateCommunicationTask(taskCommunicationManagementCommTaskId, taskCommunicationManagementTable, taskCommunicationManagementUpdateCommunicationTaskBodyParam, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-servicenow-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('TaskCommunicationManagement', 'updateCommunicationTask', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        }).timeout(attemptTimeout);
      });

      describe('#getChannelsForTable - errors', () => {
        it('should work if integrated but since no mockdata should error when run standalone', (done) => {
          try {
            a.getChannelsForTable(taskCommunicationManagementSysparmTable, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-servicenow-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('TaskCommunicationManagement', 'getChannelsForTable', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        }).timeout(attemptTimeout);
      });

      describe('#getChannelsForTableByTaskId - errors', () => {
        it('should work if integrated but since no mockdata should error when run standalone', (done) => {
          try {
            a.getChannelsForTableByTaskId(taskCommunicationManagementCommTaskId, taskCommunicationManagementTable, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-servicenow-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('TaskCommunicationManagement', 'getChannelsForTableByTaskId', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        }).timeout(attemptTimeout);
      });

      const taskCommunicationManagementTaskId = 'fakedata';
      describe('#getCommunicationGroupPlans - errors', () => {
        it('should work if integrated but since no mockdata should error when run standalone', (done) => {
          try {
            a.getCommunicationGroupPlans(taskCommunicationManagementTaskId, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-servicenow-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('TaskCommunicationManagement', 'getCommunicationGroupPlans', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        }).timeout(attemptTimeout);
      });

      describe('#getCommunicationPlans - errors', () => {
        it('should work if integrated but since no mockdata should error when run standalone', (done) => {
          try {
            a.getCommunicationPlans(taskCommunicationManagementTaskId, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-servicenow-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('TaskCommunicationManagement', 'getCommunicationPlans', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        }).timeout(attemptTimeout);
      });

      // THIS MAY REQUIRE SUPPORTING A DIFFERENT DATA TYPE
      describe('#uploadMultipartAttachment - errors', () => {
        it('should work if integrated but since no mockdata should error when run standalone', (done) => {
          try {
            a.uploadMultipartAttachment(attachmentBodyFormData, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-servicenow-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('Attachment', 'uploadMultipartAttachment', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        }).timeout(attemptTimeout);
      });

      // REQUIRES PLUGIN ACTIVATION - OR THESE (METRIC BASE) TESTS WILL FAIL
      // NEED TO FIGURE OUT HOW TO TEST THIS
      const metricBaseTimeSeriesCreateMetricBaseBodyParam = {};
      describe('#createMetricBase - errors', () => {
        it('should work if integrated but since no mockdata should error when run standalone', (done) => {
          try {
            a.createMetricBase(metricBaseTimeSeriesCreateMetricBaseBodyParam, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-servicenow-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('MetricBaseTimeSeries', 'createMetricBase', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        }).timeout(attemptTimeout);
      });

      const metricBaseTimeSeriesTable = 'fakedata';
      const metricBaseTimeSeriesSubject = 'fakedata';
      const metricBaseTimeSeriesMetric = 'fakedata';
      const metricBaseTimeSeriesSysparmEnd = 'fakedata';
      const metricBaseTimeSeriesSysparmStart = 'fakedata';
      describe('#getMetricBase - errors', () => {
        it('should work if integrated but since no mockdata should error when run standalone', (done) => {
          try {
            a.getMetricBase(metricBaseTimeSeriesTable, metricBaseTimeSeriesSubject, metricBaseTimeSeriesMetric, metricBaseTimeSeriesSysparmEnd, metricBaseTimeSeriesSysparmStart, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-servicenow-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('MetricBaseTimeSeries', 'getMetricBase', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        }).timeout(attemptTimeout);
      });

      describe('#transformMetricBase - errors', () => {
        it('should work if integrated but since no mockdata should error when run standalone', (done) => {
          try {
            a.transformMetricBase(metricBaseTimeSeriesTable, metricBaseTimeSeriesMetric, metricBaseTimeSeriesSysparmEnd, metricBaseTimeSeriesSysparmStart, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-servicenow-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('MetricBaseTimeSeries', 'transformMetricBase', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        }).timeout(attemptTimeout);
      });

      // COULD NOT GET THIS CALL TO WORK - CREATE AND GET WORK BUT IT WILL NOT ALLOW DELETE
      describe('#cancelChangeRequestConflict - errors', () => {
        it('should work if integrated but since no mockdata should error when run standalone', (done) => {
          try {
            a.cancelChangeRequestConflict(null, normalChangeId, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-servicenow-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                }
                saveMockData('ChangeManagement', 'cancelChangeRequestConflict', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        }).timeout(attemptTimeout);
      });

      // COULD NOT GET THIS CALL TO WORK - ACTIVATED PLUGIN BUT STILL NO LUCK THROUGH POSTMAN OR ADAPTER
      // TRIED INVESTIGATING ROLES AS WELL BUT TO NO AVAIL!
      const majorIncidentManagementCreateMajorIncidentBodyParam = { action: 'PROMOTE' };
      describe('#createMajorIncident - errors', () => {
        it('should work if integrated but since no mockdata should error when run standalone', (done) => {
          try {
            a.createMajorIncident(incidentsId, majorIncidentManagementCreateMajorIncidentBodyParam, (data, error) => {
              try {
                if (stub) {
                  const displayE = 'Error 400 received on request';
                  runErrorAsserts(data, error, 'AD.500', 'Test-servicenow-connectorRest-handleEndResponse', displayE);
                } else {
                  runCommonAsserts(data, error);
                  assert.equal('success', data.response);
                }
                saveMockData('MajorIncidentManagement', 'createMajorIncident', 'default', data);
                done();
              } catch (err) {
                log.error(`Test Failure: ${err}`);
                done(err);
              }
            });
          } catch (error) {
            log.error(`Adapter Exception: ${error}`);
            done(error);
          }
        }).timeout(attemptTimeout);
      });
    }
  });
});
