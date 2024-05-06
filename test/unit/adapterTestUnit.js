/* @copyright Itential, LLC 2019 (pre-modifications) */

// Set globals
/* global describe it log pronghornProps */
/* eslint global-require: warn */
/* eslint no-unused-vars: warn */
/* eslint import/no-dynamic-require:warn */

// include required items for testing & logging
const assert = require('assert');
const path = require('path');
const util = require('util');
const execute = require('child_process').execSync;
const fs = require('fs-extra');
const mocha = require('mocha');
const winston = require('winston');
const { expect } = require('chai');
const { use } = require('chai');
const td = require('testdouble');
const Ajv = require('ajv');

const ajv = new Ajv({ strictSchema: false, allErrors: true, allowUnionTypes: true });
const anything = td.matchers.anything();
let logLevel = 'none';
const isRapidFail = false;

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
samProps.request.attempt_timeout = 1200000;
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

// require the adapter that we are going to be using
const Servicenow = require('../../adapter');

// delete the .DS_Store directory in entities -- otherwise this will cause errors
const dirPath = path.join(__dirname, '../../entities/.DS_Store');
if (fs.existsSync(dirPath)) {
  try {
    fs.removeSync(dirPath);
    console.log('.DS_Store deleted');
  } catch (e) {
    console.log('Error when deleting .DS_Store:', e);
  }
}

// begin the testing - these should be pretty well defined between the describe and the it!
describe('[unit] Servicenow Adapter Test', () => {
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

    describe('adapterBase.js', () => {
      it('should have an adapterBase.js', (done) => {
        try {
          fs.exists('adapterBase.js', (val) => {
            assert.equal(true, val);
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    let wffunctions = [];
    describe('#iapGetAdapterWorkflowFunctions', () => {
      it('should retrieve workflow functions', (done) => {
        try {
          wffunctions = a.iapGetAdapterWorkflowFunctions([]);

          try {
            assert.notEqual(0, wffunctions.length);
            done();
          } catch (err) {
            log.error(`Test Failure: ${err}`);
            done(err);
          }
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('package.json', () => {
      it('should have a package.json', (done) => {
        try {
          fs.exists('package.json', (val) => {
            assert.equal(true, val);
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('package.json should be validated', (done) => {
        try {
          const packageDotJson = require('../../package.json');
          // Define the JSON schema for package.json
          const packageJsonSchema = {
            type: 'object',
            properties: {
              name: { type: 'string' },
              version: { type: 'string' }
              // May need to add more properties as needed
            },
            required: ['name', 'version']
          };
          const validate = ajv.compile(packageJsonSchema);
          const isValid = validate(packageDotJson);

          if (isValid === false) {
            log.error('The package.json contains errors');
            assert.equal(true, isValid);
          } else {
            assert.equal(true, isValid);
          }

          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('package.json standard fields should be customized', (done) => {
        try {
          const packageDotJson = require('../../package.json');
          assert.notEqual(-1, packageDotJson.name.indexOf('servicenow'));
          assert.notEqual(undefined, packageDotJson.version);
          assert.notEqual(null, packageDotJson.version);
          assert.notEqual('', packageDotJson.version);
          assert.notEqual(undefined, packageDotJson.description);
          assert.notEqual(null, packageDotJson.description);
          assert.notEqual('', packageDotJson.description);
          assert.equal('adapter.js', packageDotJson.main);
          assert.notEqual(undefined, packageDotJson.wizardVersion);
          assert.notEqual(null, packageDotJson.wizardVersion);
          assert.notEqual('', packageDotJson.wizardVersion);
          assert.notEqual(undefined, packageDotJson.engineVersion);
          assert.notEqual(null, packageDotJson.engineVersion);
          assert.notEqual('', packageDotJson.engineVersion);
          assert.equal('http', packageDotJson.adapterType);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('package.json proper scripts should be provided', (done) => {
        try {
          const packageDotJson = require('../../package.json');
          assert.notEqual(undefined, packageDotJson.scripts);
          assert.notEqual(null, packageDotJson.scripts);
          assert.notEqual('', packageDotJson.scripts);
          assert.equal('node utils/setup.js', packageDotJson.scripts.preinstall);
          assert.equal('node --max_old_space_size=4096 ./node_modules/eslint/bin/eslint.js . --ext .json --ext .js', packageDotJson.scripts.lint);
          assert.equal('node --max_old_space_size=4096 ./node_modules/eslint/bin/eslint.js . --ext .json --ext .js --quiet', packageDotJson.scripts['lint:errors']);
          assert.equal('mocha test/unit/adapterBaseTestUnit.js --LOG=error', packageDotJson.scripts['test:baseunit']);
          assert.equal('mocha test/unit/adapterTestUnit.js --LOG=error', packageDotJson.scripts['test:unit']);
          assert.equal('mocha test/integration/adapterTestIntegration.js --LOG=error', packageDotJson.scripts['test:integration']);
          assert.equal('nyc --reporter html --reporter text mocha --reporter dot test/*', packageDotJson.scripts['test:cover']);
          assert.equal('npm run test:baseunit && npm run test:unit && npm run test:integration', packageDotJson.scripts.test);
          assert.equal('npm publish --registry=https://registry.npmjs.org --access=public', packageDotJson.scripts.deploy);
          assert.equal('npm run deploy', packageDotJson.scripts.build);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('package.json proper directories should be provided', (done) => {
        try {
          const packageDotJson = require('../../package.json');
          assert.notEqual(undefined, packageDotJson.repository);
          assert.notEqual(null, packageDotJson.repository);
          assert.notEqual('', packageDotJson.repository);
          assert.equal('git', packageDotJson.repository.type);
          assert.equal('git@gitlab.com:itentialopensource/adapters/', packageDotJson.repository.url.substring(0, 43));
          assert.equal('https://gitlab.com/itentialopensource/adapters/', packageDotJson.homepage.substring(0, 47));
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('package.json proper dependencies should be provided', (done) => {
        try {
          const packageDotJson = require('../../package.json');
          assert.notEqual(undefined, packageDotJson.dependencies);
          assert.notEqual(null, packageDotJson.dependencies);
          assert.notEqual('', packageDotJson.dependencies);
          assert.equal('^8.12.0', packageDotJson.dependencies.ajv);
          assert.equal('^1.6.2', packageDotJson.dependencies.axios);
          assert.equal('^11.0.0', packageDotJson.dependencies.commander);
          assert.equal('^11.1.1', packageDotJson.dependencies['fs-extra']);
          assert.equal('^10.2.0', packageDotJson.dependencies.mocha);
          assert.equal('^2.0.1', packageDotJson.dependencies['mocha-param']);
          assert.equal('^15.1.0', packageDotJson.dependencies.nyc);
          assert.equal('^0.4.4', packageDotJson.dependencies.ping);
          assert.equal('^1.4.10', packageDotJson.dependencies['readline-sync']);
          assert.equal('^7.5.3', packageDotJson.dependencies.semver);
          assert.equal('^3.9.0', packageDotJson.dependencies.winston);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('package.json proper dev dependencies should be provided', (done) => {
        try {
          const packageDotJson = require('../../package.json');
          assert.notEqual(undefined, packageDotJson.devDependencies);
          assert.notEqual(null, packageDotJson.devDependencies);
          assert.notEqual('', packageDotJson.devDependencies);
          assert.equal('^4.3.7', packageDotJson.devDependencies.chai);
          assert.equal('^8.44.0', packageDotJson.devDependencies.eslint);
          assert.equal('^15.0.0', packageDotJson.devDependencies['eslint-config-airbnb-base']);
          assert.equal('^2.27.5', packageDotJson.devDependencies['eslint-plugin-import']);
          assert.equal('^3.1.0', packageDotJson.devDependencies['eslint-plugin-json']);
          assert.equal('^3.18.0', packageDotJson.devDependencies.testdouble);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('pronghorn.json', () => {
      it('should have a pronghorn.json', (done) => {
        try {
          fs.exists('pronghorn.json', (val) => {
            assert.equal(true, val);
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('pronghorn.json should be customized', (done) => {
        try {
          const pronghornDotJson = require('../../pronghorn.json');
          assert.notEqual(-1, pronghornDotJson.id.indexOf('servicenow'));
          assert.equal('Adapter', pronghornDotJson.type);
          assert.equal('Servicenow', pronghornDotJson.export);
          assert.equal('Servicenow', pronghornDotJson.title);
          assert.equal('adapter.js', pronghornDotJson.src);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('pronghorn.json should contain generic adapter methods', (done) => {
        try {
          const pronghornDotJson = require('../../pronghorn.json');
          assert.notEqual(undefined, pronghornDotJson.methods);
          assert.notEqual(null, pronghornDotJson.methods);
          assert.notEqual('', pronghornDotJson.methods);
          assert.equal(true, Array.isArray(pronghornDotJson.methods));
          assert.notEqual(0, pronghornDotJson.methods.length);
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapUpdateAdapterConfiguration'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapSuspendAdapter'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapUnsuspendAdapter'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapGetAdapterQueue'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapFindAdapterPath'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapTroubleshootAdapter'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapRunAdapterHealthcheck'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapRunAdapterConnectivity'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapRunAdapterBasicGet'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapMoveAdapterEntitiesToDB'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapDeactivateTasks'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapActivateTasks'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapPopulateEntityCache'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapRetrieveEntitiesCache'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'getDevice'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'getDevicesFiltered'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'isAlive'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'getConfig'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapGetDeviceCount'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapExpandedGenericAdapterRequest'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'genericAdapterRequest'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'genericAdapterRequestNoBasePath'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapRunAdapterLint'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapRunAdapterTests'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapGetAdapterInventory'));
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('pronghorn.json should only expose workflow functions', (done) => {
        try {
          const pronghornDotJson = require('../../pronghorn.json');

          for (let m = 0; m < pronghornDotJson.methods.length; m += 1) {
            let found = false;
            let paramissue = false;

            for (let w = 0; w < wffunctions.length; w += 1) {
              if (pronghornDotJson.methods[m].name === wffunctions[w]) {
                found = true;
                const methLine = execute(`grep "  ${wffunctions[w]}(" adapter.js | grep "callback) {"`).toString();
                let wfparams = [];

                if (methLine && methLine.indexOf('(') >= 0 && methLine.indexOf(')') >= 0) {
                  const temp = methLine.substring(methLine.indexOf('(') + 1, methLine.lastIndexOf(')'));
                  wfparams = temp.split(',');

                  for (let t = 0; t < wfparams.length; t += 1) {
                    // remove default value from the parameter name
                    wfparams[t] = wfparams[t].substring(0, wfparams[t].search(/=/) > 0 ? wfparams[t].search(/#|\?|=/) : wfparams[t].length);
                    // remove spaces
                    wfparams[t] = wfparams[t].trim();

                    if (wfparams[t] === 'callback') {
                      wfparams.splice(t, 1);
                    }
                  }
                }

                // if there are inputs defined but not on the method line
                if (wfparams.length === 0 && (pronghornDotJson.methods[m].input
                    && pronghornDotJson.methods[m].input.length > 0)) {
                  paramissue = true;
                } else if (wfparams.length > 0 && (!pronghornDotJson.methods[m].input
                    || pronghornDotJson.methods[m].input.length === 0)) {
                  // if there are no inputs defined but there are on the method line
                  paramissue = true;
                } else {
                  for (let p = 0; p < pronghornDotJson.methods[m].input.length; p += 1) {
                    let pfound = false;
                    for (let wfp = 0; wfp < wfparams.length; wfp += 1) {
                      if (pronghornDotJson.methods[m].input[p].name.toUpperCase() === wfparams[wfp].toUpperCase()) {
                        pfound = true;
                      }
                    }

                    if (!pfound) {
                      paramissue = true;
                    }
                  }
                  for (let wfp = 0; wfp < wfparams.length; wfp += 1) {
                    let pfound = false;
                    for (let p = 0; p < pronghornDotJson.methods[m].input.length; p += 1) {
                      if (pronghornDotJson.methods[m].input[p].name.toUpperCase() === wfparams[wfp].toUpperCase()) {
                        pfound = true;
                      }
                    }

                    if (!pfound) {
                      paramissue = true;
                    }
                  }
                }

                break;
              }
            }

            if (!found) {
              // this is the reason to go through both loops - log which ones are not found so
              // they can be worked
              log.error(`${pronghornDotJson.methods[m].name} not found in workflow functions`);
            }
            if (paramissue) {
              // this is the reason to go through both loops - log which ones are not found so
              // they can be worked
              log.error(`${pronghornDotJson.methods[m].name} has a parameter mismatch`);
            }
            assert.equal(true, found);
            assert.equal(false, paramissue);
          }
          done();
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('pronghorn.json should expose all workflow functions', (done) => {
        try {
          const pronghornDotJson = require('../../pronghorn.json');
          for (let w = 0; w < wffunctions.length; w += 1) {
            let found = false;

            for (let m = 0; m < pronghornDotJson.methods.length; m += 1) {
              if (pronghornDotJson.methods[m].name === wffunctions[w]) {
                found = true;
                break;
              }
            }

            if (!found) {
              // this is the reason to go through both loops - log which ones are not found so
              // they can be worked
              log.error(`${wffunctions[w]} not found in pronghorn.json`);
            }
            assert.equal(true, found);
          }
          done();
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      });
      it('pronghorn.json verify input/output schema objects', (done) => {
        const verifySchema = (methodName, schema) => {
          try {
            ajv.compile(schema);
          } catch (error) {
            const errorMessage = `Invalid schema found in '${methodName}' method.
          Schema => ${JSON.stringify(schema)}.
          Details => ${error.message}`;
            throw new Error(errorMessage);
          }
        };

        try {
          const pronghornDotJson = require('../../pronghorn.json');
          const { methods } = pronghornDotJson;
          for (let i = 0; i < methods.length; i += 1) {
            for (let j = 0; j < methods[i].input.length; j += 1) {
              const inputSchema = methods[i].input[j].schema;
              if (inputSchema) {
                verifySchema(methods[i].name, inputSchema);
              }
            }
            const outputSchema = methods[i].output.schema;
            if (outputSchema) {
              verifySchema(methods[i].name, outputSchema);
            }
          }
          done();
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      });
    });

    describe('propertiesSchema.json', () => {
      it('should have a propertiesSchema.json', (done) => {
        try {
          fs.exists('propertiesSchema.json', (val) => {
            assert.equal(true, val);
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('propertiesSchema.json should be customized', (done) => {
        try {
          const propertiesDotJson = require('../../propertiesSchema.json');
          assert.equal('adapter-servicenow', propertiesDotJson.$id);
          assert.equal('object', propertiesDotJson.type);
          assert.equal('http://json-schema.org/draft-07/schema#', propertiesDotJson.$schema);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('propertiesSchema.json should contain generic adapter properties', (done) => {
        try {
          const propertiesDotJson = require('../../propertiesSchema.json');
          assert.notEqual(undefined, propertiesDotJson.properties);
          assert.notEqual(null, propertiesDotJson.properties);
          assert.notEqual('', propertiesDotJson.properties);
          assert.equal('string', propertiesDotJson.properties.host.type);
          assert.equal('integer', propertiesDotJson.properties.port.type);
          assert.equal('boolean', propertiesDotJson.properties.stub.type);
          assert.equal('string', propertiesDotJson.properties.protocol.type);
          assert.notEqual(undefined, propertiesDotJson.definitions.authentication);
          assert.notEqual(null, propertiesDotJson.definitions.authentication);
          assert.notEqual('', propertiesDotJson.definitions.authentication);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.auth_method.type);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.username.type);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.password.type);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.token.type);
          assert.equal('integer', propertiesDotJson.definitions.authentication.properties.invalid_token_error.type);
          assert.equal('integer', propertiesDotJson.definitions.authentication.properties.token_timeout.type);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.token_cache.type);
          assert.equal(true, Array.isArray(propertiesDotJson.definitions.authentication.properties.auth_field.type));
          assert.equal(true, Array.isArray(propertiesDotJson.definitions.authentication.properties.auth_field_format.type));
          assert.equal('boolean', propertiesDotJson.definitions.authentication.properties.auth_logging.type);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.client_id.type);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.client_secret.type);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.grant_type.type);
          assert.notEqual(undefined, propertiesDotJson.definitions.ssl);
          assert.notEqual(null, propertiesDotJson.definitions.ssl);
          assert.notEqual('', propertiesDotJson.definitions.ssl);
          assert.equal('string', propertiesDotJson.definitions.ssl.properties.ecdhCurve.type);
          assert.equal('boolean', propertiesDotJson.definitions.ssl.properties.enabled.type);
          assert.equal('boolean', propertiesDotJson.definitions.ssl.properties.accept_invalid_cert.type);
          assert.equal('string', propertiesDotJson.definitions.ssl.properties.ca_file.type);
          assert.equal('string', propertiesDotJson.definitions.ssl.properties.key_file.type);
          assert.equal('string', propertiesDotJson.definitions.ssl.properties.cert_file.type);
          assert.equal('string', propertiesDotJson.definitions.ssl.properties.secure_protocol.type);
          assert.equal('string', propertiesDotJson.definitions.ssl.properties.ciphers.type);
          assert.equal('string', propertiesDotJson.properties.base_path.type);
          assert.equal('string', propertiesDotJson.properties.version.type);
          assert.equal('string', propertiesDotJson.properties.cache_location.type);
          assert.equal('boolean', propertiesDotJson.properties.encode_pathvars.type);
          assert.equal('boolean', propertiesDotJson.properties.encode_queryvars.type);
          assert.equal(true, Array.isArray(propertiesDotJson.properties.save_metric.type));
          assert.notEqual(undefined, propertiesDotJson.definitions);
          assert.notEqual(null, propertiesDotJson.definitions);
          assert.notEqual('', propertiesDotJson.definitions);
          assert.notEqual(undefined, propertiesDotJson.definitions.healthcheck);
          assert.notEqual(null, propertiesDotJson.definitions.healthcheck);
          assert.notEqual('', propertiesDotJson.definitions.healthcheck);
          assert.equal('string', propertiesDotJson.definitions.healthcheck.properties.type.type);
          assert.equal('integer', propertiesDotJson.definitions.healthcheck.properties.frequency.type);
          assert.equal('object', propertiesDotJson.definitions.healthcheck.properties.query_object.type);
          assert.notEqual(undefined, propertiesDotJson.definitions.throttle);
          assert.notEqual(null, propertiesDotJson.definitions.throttle);
          assert.notEqual('', propertiesDotJson.definitions.throttle);
          assert.equal('boolean', propertiesDotJson.definitions.throttle.properties.throttle_enabled.type);
          assert.equal('integer', propertiesDotJson.definitions.throttle.properties.number_pronghorns.type);
          assert.equal('string', propertiesDotJson.definitions.throttle.properties.sync_async.type);
          assert.equal('integer', propertiesDotJson.definitions.throttle.properties.max_in_queue.type);
          assert.equal('integer', propertiesDotJson.definitions.throttle.properties.concurrent_max.type);
          assert.equal('integer', propertiesDotJson.definitions.throttle.properties.expire_timeout.type);
          assert.equal('integer', propertiesDotJson.definitions.throttle.properties.avg_runtime.type);
          assert.equal('array', propertiesDotJson.definitions.throttle.properties.priorities.type);
          assert.notEqual(undefined, propertiesDotJson.definitions.request);
          assert.notEqual(null, propertiesDotJson.definitions.request);
          assert.notEqual('', propertiesDotJson.definitions.request);
          assert.equal('integer', propertiesDotJson.definitions.request.properties.number_redirects.type);
          assert.equal('integer', propertiesDotJson.definitions.request.properties.number_retries.type);
          assert.equal(true, Array.isArray(propertiesDotJson.definitions.request.properties.limit_retry_error.type));
          assert.equal('array', propertiesDotJson.definitions.request.properties.failover_codes.type);
          assert.equal('integer', propertiesDotJson.definitions.request.properties.attempt_timeout.type);
          assert.equal('object', propertiesDotJson.definitions.request.properties.global_request.type);
          assert.equal('object', propertiesDotJson.definitions.request.properties.global_request.properties.payload.type);
          assert.equal('object', propertiesDotJson.definitions.request.properties.global_request.properties.uriOptions.type);
          assert.equal('object', propertiesDotJson.definitions.request.properties.global_request.properties.addlHeaders.type);
          assert.equal('object', propertiesDotJson.definitions.request.properties.global_request.properties.authData.type);
          assert.equal('boolean', propertiesDotJson.definitions.request.properties.healthcheck_on_timeout.type);
          assert.equal('boolean', propertiesDotJson.definitions.request.properties.return_raw.type);
          assert.equal('boolean', propertiesDotJson.definitions.request.properties.archiving.type);
          assert.equal('boolean', propertiesDotJson.definitions.request.properties.return_request.type);
          assert.notEqual(undefined, propertiesDotJson.definitions.proxy);
          assert.notEqual(null, propertiesDotJson.definitions.proxy);
          assert.notEqual('', propertiesDotJson.definitions.proxy);
          assert.equal('boolean', propertiesDotJson.definitions.proxy.properties.enabled.type);
          assert.equal('string', propertiesDotJson.definitions.proxy.properties.host.type);
          assert.equal('integer', propertiesDotJson.definitions.proxy.properties.port.type);
          assert.equal('string', propertiesDotJson.definitions.proxy.properties.protocol.type);
          assert.equal('string', propertiesDotJson.definitions.proxy.properties.username.type);
          assert.equal('string', propertiesDotJson.definitions.proxy.properties.password.type);
          assert.notEqual(undefined, propertiesDotJson.definitions.mongo);
          assert.notEqual(null, propertiesDotJson.definitions.mongo);
          assert.notEqual('', propertiesDotJson.definitions.mongo);
          assert.equal('string', propertiesDotJson.definitions.mongo.properties.host.type);
          assert.equal('integer', propertiesDotJson.definitions.mongo.properties.port.type);
          assert.equal('string', propertiesDotJson.definitions.mongo.properties.database.type);
          assert.equal('string', propertiesDotJson.definitions.mongo.properties.username.type);
          assert.equal('string', propertiesDotJson.definitions.mongo.properties.password.type);
          assert.equal('string', propertiesDotJson.definitions.mongo.properties.replSet.type);
          assert.equal('object', propertiesDotJson.definitions.mongo.properties.db_ssl.type);
          assert.equal('boolean', propertiesDotJson.definitions.mongo.properties.db_ssl.properties.enabled.type);
          assert.equal('boolean', propertiesDotJson.definitions.mongo.properties.db_ssl.properties.accept_invalid_cert.type);
          assert.equal('string', propertiesDotJson.definitions.mongo.properties.db_ssl.properties.ca_file.type);
          assert.equal('string', propertiesDotJson.definitions.mongo.properties.db_ssl.properties.key_file.type);
          assert.equal('string', propertiesDotJson.definitions.mongo.properties.db_ssl.properties.cert_file.type);
          assert.notEqual('', propertiesDotJson.definitions.devicebroker);
          assert.equal('array', propertiesDotJson.definitions.devicebroker.properties.getDevice.type);
          assert.equal('array', propertiesDotJson.definitions.devicebroker.properties.getDevicesFiltered.type);
          assert.equal('array', propertiesDotJson.definitions.devicebroker.properties.isAlive.type);
          assert.equal('array', propertiesDotJson.definitions.devicebroker.properties.getConfig.type);
          assert.equal('array', propertiesDotJson.definitions.devicebroker.properties.getCount.type);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('error.json', () => {
      it('should have an error.json', (done) => {
        try {
          fs.exists('error.json', (val) => {
            assert.equal(true, val);
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('error.json should have standard adapter errors', (done) => {
        try {
          const errorDotJson = require('../../error.json');
          assert.notEqual(undefined, errorDotJson.errors);
          assert.notEqual(null, errorDotJson.errors);
          assert.notEqual('', errorDotJson.errors);
          assert.equal(true, Array.isArray(errorDotJson.errors));
          assert.notEqual(0, errorDotJson.errors.length);
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.100'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.101'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.102'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.110'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.111'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.112'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.113'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.114'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.115'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.116'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.300'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.301'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.302'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.303'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.304'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.305'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.310'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.311'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.312'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.320'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.321'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.400'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.401'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.402'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.500'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.501'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.502'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.503'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.600'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.900'));
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('sampleProperties.json', () => {
      it('should have a sampleProperties.json', (done) => {
        try {
          fs.exists('sampleProperties.json', (val) => {
            assert.equal(true, val);
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('sampleProperties.json should contain generic adapter properties', (done) => {
        try {
          const sampleDotJson = require('../../sampleProperties.json');
          assert.notEqual(-1, sampleDotJson.id.indexOf('servicenow'));
          assert.equal('Servicenow', sampleDotJson.type);
          assert.notEqual(undefined, sampleDotJson.properties);
          assert.notEqual(null, sampleDotJson.properties);
          assert.notEqual('', sampleDotJson.properties);
          assert.notEqual(undefined, sampleDotJson.properties.host);
          assert.notEqual(undefined, sampleDotJson.properties.port);
          assert.notEqual(undefined, sampleDotJson.properties.stub);
          assert.notEqual(undefined, sampleDotJson.properties.protocol);
          assert.notEqual(undefined, sampleDotJson.properties.authentication);
          assert.notEqual(null, sampleDotJson.properties.authentication);
          assert.notEqual('', sampleDotJson.properties.authentication);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.auth_method);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.username);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.password);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.token);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.invalid_token_error);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.token_timeout);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.token_cache);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.auth_field);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.auth_field_format);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.auth_logging);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.client_id);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.client_secret);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.grant_type);
          assert.notEqual(undefined, sampleDotJson.properties.ssl);
          assert.notEqual(null, sampleDotJson.properties.ssl);
          assert.notEqual('', sampleDotJson.properties.ssl);
          assert.notEqual(undefined, sampleDotJson.properties.ssl.ecdhCurve);
          assert.notEqual(undefined, sampleDotJson.properties.ssl.enabled);
          assert.notEqual(undefined, sampleDotJson.properties.ssl.accept_invalid_cert);
          assert.notEqual(undefined, sampleDotJson.properties.ssl.ca_file);
          assert.notEqual(undefined, sampleDotJson.properties.ssl.key_file);
          assert.notEqual(undefined, sampleDotJson.properties.ssl.cert_file);
          assert.notEqual(undefined, sampleDotJson.properties.ssl.secure_protocol);
          assert.notEqual(undefined, sampleDotJson.properties.ssl.ciphers);
          assert.notEqual(undefined, sampleDotJson.properties.base_path);
          assert.notEqual(undefined, sampleDotJson.properties.version);
          assert.notEqual(undefined, sampleDotJson.properties.cache_location);
          assert.notEqual(undefined, sampleDotJson.properties.encode_pathvars);
          assert.notEqual(undefined, sampleDotJson.properties.encode_queryvars);
          assert.notEqual(undefined, sampleDotJson.properties.save_metric);
          assert.notEqual(undefined, sampleDotJson.properties.healthcheck);
          assert.notEqual(null, sampleDotJson.properties.healthcheck);
          assert.notEqual('', sampleDotJson.properties.healthcheck);
          assert.notEqual(undefined, sampleDotJson.properties.healthcheck.type);
          assert.notEqual(undefined, sampleDotJson.properties.healthcheck.frequency);
          assert.notEqual(undefined, sampleDotJson.properties.healthcheck.query_object);
          assert.notEqual(undefined, sampleDotJson.properties.throttle);
          assert.notEqual(null, sampleDotJson.properties.throttle);
          assert.notEqual('', sampleDotJson.properties.throttle);
          assert.notEqual(undefined, sampleDotJson.properties.throttle.throttle_enabled);
          assert.notEqual(undefined, sampleDotJson.properties.throttle.number_pronghorns);
          assert.notEqual(undefined, sampleDotJson.properties.throttle.sync_async);
          assert.notEqual(undefined, sampleDotJson.properties.throttle.max_in_queue);
          assert.notEqual(undefined, sampleDotJson.properties.throttle.concurrent_max);
          assert.notEqual(undefined, sampleDotJson.properties.throttle.expire_timeout);
          assert.notEqual(undefined, sampleDotJson.properties.throttle.avg_runtime);
          assert.notEqual(undefined, sampleDotJson.properties.throttle.priorities);
          assert.notEqual(undefined, sampleDotJson.properties.request);
          assert.notEqual(null, sampleDotJson.properties.request);
          assert.notEqual('', sampleDotJson.properties.request);
          assert.notEqual(undefined, sampleDotJson.properties.request.number_redirects);
          assert.notEqual(undefined, sampleDotJson.properties.request.number_retries);
          assert.notEqual(undefined, sampleDotJson.properties.request.limit_retry_error);
          assert.notEqual(undefined, sampleDotJson.properties.request.failover_codes);
          assert.notEqual(undefined, sampleDotJson.properties.request.attempt_timeout);
          assert.notEqual(undefined, sampleDotJson.properties.request.global_request);
          assert.notEqual(undefined, sampleDotJson.properties.request.global_request.payload);
          assert.notEqual(undefined, sampleDotJson.properties.request.global_request.uriOptions);
          assert.notEqual(undefined, sampleDotJson.properties.request.global_request.addlHeaders);
          assert.notEqual(undefined, sampleDotJson.properties.request.global_request.authData);
          assert.notEqual(undefined, sampleDotJson.properties.request.healthcheck_on_timeout);
          assert.notEqual(undefined, sampleDotJson.properties.request.return_raw);
          assert.notEqual(undefined, sampleDotJson.properties.request.archiving);
          assert.notEqual(undefined, sampleDotJson.properties.request.return_request);
          assert.notEqual(undefined, sampleDotJson.properties.proxy);
          assert.notEqual(null, sampleDotJson.properties.proxy);
          assert.notEqual('', sampleDotJson.properties.proxy);
          assert.notEqual(undefined, sampleDotJson.properties.proxy.enabled);
          assert.notEqual(undefined, sampleDotJson.properties.proxy.host);
          assert.notEqual(undefined, sampleDotJson.properties.proxy.port);
          assert.notEqual(undefined, sampleDotJson.properties.proxy.protocol);
          assert.notEqual(undefined, sampleDotJson.properties.proxy.username);
          assert.notEqual(undefined, sampleDotJson.properties.proxy.password);
          assert.notEqual(undefined, sampleDotJson.properties.mongo);
          assert.notEqual(null, sampleDotJson.properties.mongo);
          assert.notEqual('', sampleDotJson.properties.mongo);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.host);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.port);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.database);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.username);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.password);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.replSet);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.db_ssl);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.db_ssl.enabled);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.db_ssl.accept_invalid_cert);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.db_ssl.ca_file);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.db_ssl.key_file);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.db_ssl.cert_file);
          assert.notEqual(undefined, sampleDotJson.properties.devicebroker);
          assert.notEqual(undefined, sampleDotJson.properties.devicebroker.getDevice);
          assert.notEqual(undefined, sampleDotJson.properties.devicebroker.getDevicesFiltered);
          assert.notEqual(undefined, sampleDotJson.properties.devicebroker.isAlive);
          assert.notEqual(undefined, sampleDotJson.properties.devicebroker.getConfig);
          assert.notEqual(undefined, sampleDotJson.properties.devicebroker.getCount);
          assert.notEqual(undefined, sampleDotJson.properties.cache);
          assert.notEqual(undefined, sampleDotJson.properties.cache.entities);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#checkProperties', () => {
      it('should have a checkProperties function', (done) => {
        try {
          assert.equal(true, typeof a.checkProperties === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('the sample properties should be good - if failure change the log level', (done) => {
        try {
          const samplePropsJson = require('../../sampleProperties.json');
          const clean = a.checkProperties(samplePropsJson.properties);

          try {
            assert.notEqual(0, Object.keys(clean));
            assert.equal(undefined, clean.exception);
            assert.notEqual(undefined, clean.host);
            assert.notEqual(null, clean.host);
            assert.notEqual('', clean.host);
            done();
          } catch (err) {
            log.error(`Test Failure: ${err}`);
            done(err);
          }
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('README.md', () => {
      it('should have a README', (done) => {
        try {
          fs.exists('README.md', (val) => {
            assert.equal(true, val);
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('README.md should be customized', (done) => {
        try {
          fs.readFile('README.md', 'utf8', (err, data) => {
            assert.equal(-1, data.indexOf('[System]'));
            assert.equal(-1, data.indexOf('[system]'));
            assert.equal(-1, data.indexOf('[version]'));
            assert.equal(-1, data.indexOf('[namespace]'));
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#connect', () => {
      it('should have a connect function', (done) => {
        try {
          assert.equal(true, typeof a.connect === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#healthCheck', () => {
      it('should have a healthCheck function', (done) => {
        try {
          assert.equal(true, typeof a.healthCheck === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapUpdateAdapterConfiguration', () => {
      it('should have a iapUpdateAdapterConfiguration function', (done) => {
        try {
          assert.equal(true, typeof a.iapUpdateAdapterConfiguration === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapSuspendAdapter', () => {
      it('should have a iapSuspendAdapter function', (done) => {
        try {
          assert.equal(true, typeof a.iapSuspendAdapter === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapUnsuspendAdapter', () => {
      it('should have a iapUnsuspendAdapter function', (done) => {
        try {
          assert.equal(true, typeof a.iapUnsuspendAdapter === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapGetAdapterQueue', () => {
      it('should have a iapGetAdapterQueue function', (done) => {
        try {
          assert.equal(true, typeof a.iapGetAdapterQueue === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapFindAdapterPath', () => {
      it('should have a iapFindAdapterPath function', (done) => {
        try {
          assert.equal(true, typeof a.iapFindAdapterPath === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('iapFindAdapterPath should find atleast one path that matches', (done) => {
        try {
          a.iapFindAdapterPath('{base_path}/{version}', (data, error) => {
            try {
              assert.equal(undefined, error);
              assert.notEqual(undefined, data);
              assert.notEqual(null, data);
              assert.equal(true, data.found);
              assert.notEqual(undefined, data.foundIn);
              assert.notEqual(null, data.foundIn);
              assert.notEqual(0, data.foundIn.length);
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

    describe('#iapTroubleshootAdapter', () => {
      it('should have a iapTroubleshootAdapter function', (done) => {
        try {
          assert.equal(true, typeof a.iapTroubleshootAdapter === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapRunAdapterHealthcheck', () => {
      it('should have a iapRunAdapterHealthcheck function', (done) => {
        try {
          assert.equal(true, typeof a.iapRunAdapterHealthcheck === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapRunAdapterConnectivity', () => {
      it('should have a iapRunAdapterConnectivity function', (done) => {
        try {
          assert.equal(true, typeof a.iapRunAdapterConnectivity === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapRunAdapterBasicGet', () => {
      it('should have a iapRunAdapterBasicGet function', (done) => {
        try {
          assert.equal(true, typeof a.iapRunAdapterBasicGet === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapMoveAdapterEntitiesToDB', () => {
      it('should have a iapMoveAdapterEntitiesToDB function', (done) => {
        try {
          assert.equal(true, typeof a.iapMoveAdapterEntitiesToDB === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#checkActionFiles', () => {
      it('should have a checkActionFiles function', (done) => {
        try {
          assert.equal(true, typeof a.checkActionFiles === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('the action files should be good - if failure change the log level as most issues are warnings', (done) => {
        try {
          const clean = a.checkActionFiles();

          try {
            for (let c = 0; c < clean.length; c += 1) {
              log.error(clean[c]);
            }
            assert.equal(0, clean.length);
            done();
          } catch (err) {
            log.error(`Test Failure: ${err}`);
            done(err);
          }
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#encryptProperty', () => {
      it('should have a encryptProperty function', (done) => {
        try {
          assert.equal(true, typeof a.encryptProperty === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('should get base64 encoded property', (done) => {
        try {
          a.encryptProperty('testing', 'base64', (data, error) => {
            try {
              assert.equal(undefined, error);
              assert.notEqual(undefined, data);
              assert.notEqual(null, data);
              assert.notEqual(undefined, data.response);
              assert.notEqual(null, data.response);
              assert.equal(0, data.response.indexOf('{code}'));
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
      it('should get encrypted property', (done) => {
        try {
          a.encryptProperty('testing', 'encrypt', (data, error) => {
            try {
              assert.equal(undefined, error);
              assert.notEqual(undefined, data);
              assert.notEqual(null, data);
              assert.notEqual(undefined, data.response);
              assert.notEqual(null, data.response);
              assert.equal(0, data.response.indexOf('{crypt}'));
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

    describe('#iapDeactivateTasks', () => {
      it('should have a iapDeactivateTasks function', (done) => {
        try {
          assert.equal(true, typeof a.iapDeactivateTasks === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapActivateTasks', () => {
      it('should have a iapActivateTasks function', (done) => {
        try {
          assert.equal(true, typeof a.iapActivateTasks === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapPopulateEntityCache', () => {
      it('should have a iapPopulateEntityCache function', (done) => {
        try {
          assert.equal(true, typeof a.iapPopulateEntityCache === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapRetrieveEntitiesCache', () => {
      it('should have a iapRetrieveEntitiesCache function', (done) => {
        try {
          assert.equal(true, typeof a.iapRetrieveEntitiesCache === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#hasEntities', () => {
      it('should have a hasEntities function', (done) => {
        try {
          assert.equal(true, typeof a.hasEntities === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#getDevice', () => {
      it('should have a getDevice function', (done) => {
        try {
          assert.equal(true, typeof a.getDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#getDevicesFiltered', () => {
      it('should have a getDevicesFiltered function', (done) => {
        try {
          assert.equal(true, typeof a.getDevicesFiltered === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#isAlive', () => {
      it('should have a isAlive function', (done) => {
        try {
          assert.equal(true, typeof a.isAlive === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#getConfig', () => {
      it('should have a getConfig function', (done) => {
        try {
          assert.equal(true, typeof a.getConfig === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapGetDeviceCount', () => {
      it('should have a iapGetDeviceCount function', (done) => {
        try {
          assert.equal(true, typeof a.iapGetDeviceCount === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapExpandedGenericAdapterRequest', () => {
      it('should have a iapExpandedGenericAdapterRequest function', (done) => {
        try {
          assert.equal(true, typeof a.iapExpandedGenericAdapterRequest === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#genericAdapterRequest', () => {
      it('should have a genericAdapterRequest function', (done) => {
        try {
          assert.equal(true, typeof a.genericAdapterRequest === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#genericAdapterRequestNoBasePath', () => {
      it('should have a genericAdapterRequestNoBasePath function', (done) => {
        try {
          assert.equal(true, typeof a.genericAdapterRequestNoBasePath === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapRunAdapterLint', () => {
      it('should have a iapRunAdapterLint function', (done) => {
        try {
          assert.equal(true, typeof a.iapRunAdapterLint === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('retrieve the lint results', (done) => {
        try {
          a.iapRunAdapterLint((data, error) => {
            try {
              assert.equal(undefined, error);
              assert.notEqual(undefined, data);
              assert.notEqual(null, data);
              assert.notEqual(undefined, data.status);
              assert.notEqual(null, data.status);
              assert.equal('SUCCESS', data.status);
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

    describe('#iapRunAdapterTests', () => {
      it('should have a iapRunAdapterTests function', (done) => {
        try {
          assert.equal(true, typeof a.iapRunAdapterTests === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapGetAdapterInventory', () => {
      it('should have a iapGetAdapterInventory function', (done) => {
        try {
          assert.equal(true, typeof a.iapGetAdapterInventory === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('retrieve the inventory', (done) => {
        try {
          a.iapGetAdapterInventory((data, error) => {
            try {
              assert.equal(undefined, error);
              assert.notEqual(undefined, data);
              assert.notEqual(null, data);
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
    describe('metadata.json', () => {
      it('should have a metadata.json', (done) => {
        try {
          fs.exists('metadata.json', (val) => {
            assert.equal(true, val);
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('metadata.json is customized', (done) => {
        try {
          const metadataDotJson = require('../../metadata.json');
          assert.equal('adapter-servicenow', metadataDotJson.name);
          assert.notEqual(undefined, metadataDotJson.webName);
          assert.notEqual(null, metadataDotJson.webName);
          assert.notEqual('', metadataDotJson.webName);
          assert.equal('Adapter', metadataDotJson.type);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('metadata.json contains accurate documentation', (done) => {
        try {
          const metadataDotJson = require('../../metadata.json');
          assert.notEqual(undefined, metadataDotJson.documentation);
          assert.equal('https://www.npmjs.com/package/@itentialopensource/adapter-servicenow', metadataDotJson.documentation.npmLink);
          assert.equal('https://docs.itential.com/opensource/docs/troubleshooting-an-adapter', metadataDotJson.documentation.faqLink);
          assert.equal('https://gitlab.com/itentialopensource/adapters/contributing-guide', metadataDotJson.documentation.contributeLink);
          assert.equal('https://itential.atlassian.net/servicedesk/customer/portals', metadataDotJson.documentation.issueLink);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('metadata.json has related items', (done) => {
        try {
          const metadataDotJson = require('../../metadata.json');
          assert.notEqual(undefined, metadataDotJson.relatedItems);
          assert.notEqual(undefined, metadataDotJson.relatedItems.adapters);
          assert.notEqual(undefined, metadataDotJson.relatedItems.integrations);
          assert.notEqual(undefined, metadataDotJson.relatedItems.ecosystemApplications);
          assert.notEqual(undefined, metadataDotJson.relatedItems.workflowProjects);
          assert.notEqual(undefined, metadataDotJson.relatedItems.transformationProjects);
          assert.notEqual(undefined, metadataDotJson.relatedItems.exampleProjects);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });
    /*
    -----------------------------------------------------------------------
    -----------------------------------------------------------------------
    *** All code above this comment will be replaced during a migration ***
    ******************* DO NOT REMOVE THIS COMMENT BLOCK ******************
    -----------------------------------------------------------------------
    -----------------------------------------------------------------------
    */

    describe('#queryTableByNameAndId - errors', () => {
      it('should have a queryTableByNameAndId function', (done) => {
        try {
          assert.equal(true, typeof a.queryTableByNameAndId === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing tableName', (done) => {
        try {
          a.queryTableByNameAndId(null, null, (data, error) => {
            try {
              const displayE = 'tableName is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-queryTableByNameAndId', displayE);
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
      it('should error if - missing recordId', (done) => {
        try {
          a.queryTableByNameAndId('fakeparam', null, (data, error) => {
            try {
              const displayE = 'recordId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-queryTableByNameAndId', displayE);
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
      it('should have a queryTableByName function', (done) => {
        try {
          assert.equal(true, typeof a.queryTableByName === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing tableName', (done) => {
        try {
          a.queryTableByName(null, null, (data, error) => {
            try {
              const displayE = 'tableName is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-queryTableByNameWithLimit', displayE);
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
      it('should have a queryTableByNameWithLimit function', (done) => {
        try {
          assert.equal(true, typeof a.queryTableByNameWithLimit === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing tableName', (done) => {
        try {
          a.queryTableByNameWithLimit(null, null, null, null, null, (data, error) => {
            try {
              const displayE = 'tableName is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-queryTableByNameWithLimit', displayE);
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

    describe('#createRecordInTable - errors', () => {
      it('should have a createRecordInTable function', (done) => {
        try {
          assert.equal(true, typeof a.createRecordInTable === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing tableName', (done) => {
        try {
          a.createRecordInTable(null, null, (data, error) => {
            try {
              const displayE = 'tableName is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-createRecordInTable', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.createRecordInTable('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-createRecordInTable', displayE);
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
      it('should have a updateTableRecord function', (done) => {
        try {
          assert.equal(true, typeof a.updateTableRecord === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing tableName', (done) => {
        try {
          a.updateTableRecord(null, null, null, (data, error) => {
            try {
              const displayE = 'tableName is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-updateTableRecord', displayE);
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
      it('should error if - missing recordId', (done) => {
        try {
          a.updateTableRecord('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'recordId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-updateTableRecord', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.updateTableRecord('fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-updateTableRecord', displayE);
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
      it('should have a deleteTableRecord function', (done) => {
        try {
          assert.equal(true, typeof a.deleteTableRecord === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing tableName', (done) => {
        try {
          a.deleteTableRecord(null, null, (data, error) => {
            try {
              const displayE = 'tableName is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-deleteTableRecord', displayE);
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
      it('should error if - missing recordId', (done) => {
        try {
          a.deleteTableRecord('fakeparam', null, (data, error) => {
            try {
              const displayE = 'recordId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-deleteTableRecord', displayE);
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
      it('should have a getAgentPresence function', (done) => {
        try {
          assert.equal(true, typeof a.getAgentPresence === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing agentId', (done) => {
        try {
          a.getAgentPresence(null, (data, error) => {
            try {
              const displayE = 'agentId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getAgentPresence', displayE);
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

    describe('#setAgentPresence - errors', () => {
      it('should have a setAgentPresence function', (done) => {
        try {
          assert.equal(true, typeof a.setAgentPresence === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing agentId', (done) => {
        try {
          a.setAgentPresence(null, null, (data, error) => {
            try {
              const displayE = 'agentId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-setAgentPresence', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.setAgentPresence('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-setAgentPresence', displayE);
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

    describe('#getStandardChangeRequest - errors', () => {
      it('should have a getStandardChangeRequest function', (done) => {
        try {
          assert.equal(true, typeof a.getStandardChangeRequest === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getStandardChangeRequestById - errors', () => {
      it('should have a getStandardChangeRequestById function', (done) => {
        try {
          assert.equal(true, typeof a.getStandardChangeRequestById === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing changeId', (done) => {
        try {
          a.getStandardChangeRequestById('fakeparam', null, (data, error) => {
            try {
              const displayE = 'changeId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getStandardChangeRequestById', displayE);
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
      it('should have a deleteStandardChangeRequestById function', (done) => {
        try {
          assert.equal(true, typeof a.deleteStandardChangeRequestById === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing changeId', (done) => {
        try {
          a.deleteStandardChangeRequestById('fakeparam', null, (data, error) => {
            try {
              const displayE = 'changeId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-deleteStandardChangeRequestById', displayE);
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

    describe('#getStandardChangeTemplate - errors', () => {
      it('should have a getStandardChangeTemplate function', (done) => {
        try {
          assert.equal(true, typeof a.getStandardChangeTemplate === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getStandardChangeTemplateById - errors', () => {
      it('should have a getStandardChangeTemplateById function', (done) => {
        try {
          assert.equal(true, typeof a.getStandardChangeTemplateById === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing changeId', (done) => {
        try {
          a.getStandardChangeTemplateById('fakeparam', null, (data, error) => {
            try {
              const displayE = 'changeId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getStandardChangeTemplateById', displayE);
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
      it('should have a changeStandardTemplateById function', (done) => {
        try {
          assert.equal(true, typeof a.changeStandardTemplateById === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing standardChangeTemplateId', (done) => {
        try {
          a.changeStandardTemplateById(null, (data, error) => {
            try {
              const displayE = 'standardChangeTemplateId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-changeStandardTemplateById', displayE);
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
      it('should have a getNormalChangeRequest function', (done) => {
        try {
          assert.equal(true, typeof a.getNormalChangeRequest === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getNormalChangeRequestById - errors', () => {
      it('should have a getNormalChangeRequestById function', (done) => {
        try {
          assert.equal(true, typeof a.getNormalChangeRequestById === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing changeId', (done) => {
        try {
          a.getNormalChangeRequestById('fakeparam', null, (data, error) => {
            try {
              const displayE = 'changeId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getNormalChangeRequestById', displayE);
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

    describe('#createNormalChangeRequest - errors', () => {
      it('should have a createNormalChangeRequest function', (done) => {
        try {
          assert.equal(true, typeof a.createNormalChangeRequest === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing change', (done) => {
        try {
          a.createNormalChangeRequest(null, (data, error) => {
            try {
              const displayE = 'change is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-createNormalChangeRequest', displayE);
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

    describe('#updateNormalChangeRequestById - errors', () => {
      it('should have a updateNormalChangeRequestById function', (done) => {
        try {
          assert.equal(true, typeof a.updateNormalChangeRequestById === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing changeId', (done) => {
        try {
          a.updateNormalChangeRequestById(null, null, (data, error) => {
            try {
              const displayE = 'changeId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-updateNormalChangeRequestById', displayE);
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
      it('should error if - missing change', (done) => {
        try {
          a.updateNormalChangeRequestById('fakeparam', null, (data, error) => {
            try {
              const displayE = 'change is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-updateNormalChangeRequestById', displayE);
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
      it('should have a deleteNormalChangeRequestById function', (done) => {
        try {
          assert.equal(true, typeof a.deleteNormalChangeRequestById === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing changeId', (done) => {
        try {
          a.deleteNormalChangeRequestById('fakeparam', null, (data, error) => {
            try {
              const displayE = 'changeId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-deleteNormalChangeRequestById', displayE);
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
      it('should have a getEmergencyChangeRequest function', (done) => {
        try {
          assert.equal(true, typeof a.getEmergencyChangeRequest === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getEmergencyChangeRequestById - errors', () => {
      it('should have a getEmergencyChangeRequestById function', (done) => {
        try {
          assert.equal(true, typeof a.getEmergencyChangeRequestById === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing changeId', (done) => {
        try {
          a.getEmergencyChangeRequestById('fakeparam', null, (data, error) => {
            try {
              const displayE = 'changeId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getEmergencyChangeRequestById', displayE);
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

    describe('#createEmergencyChangeRequest - errors', () => {
      it('should have a createEmergencyChangeRequest function', (done) => {
        try {
          assert.equal(true, typeof a.createEmergencyChangeRequest === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteEmergencyChangeRequestById - errors', () => {
      it('should have a deleteEmergencyChangeRequestById function', (done) => {
        try {
          assert.equal(true, typeof a.deleteEmergencyChangeRequestById === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing changeId', (done) => {
        try {
          a.deleteEmergencyChangeRequestById('fakeparam', null, (data, error) => {
            try {
              const displayE = 'changeId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-deleteEmergencyChangeRequestById', displayE);
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
      it('should have a getChangeRequestTask function', (done) => {
        try {
          assert.equal(true, typeof a.getChangeRequestTask === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing changeId', (done) => {
        try {
          a.getChangeRequestTask('fakeparam', null, (data, error) => {
            try {
              const displayE = 'changeId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getChangeRequestTask', displayE);
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
      it('should have a getChangeTaskByTaskId function', (done) => {
        try {
          assert.equal(true, typeof a.getChangeTaskByTaskId === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing changeId', (done) => {
        try {
          a.getChangeTaskByTaskId('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'changeId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getChangeTaskByTaskId', displayE);
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
      it('should error if - missing taskId', (done) => {
        try {
          a.getChangeTaskByTaskId('fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'taskId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getChangeTaskByTaskId', displayE);
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

    describe('#createChangeRequestTask - errors', () => {
      it('should have a createChangeRequestTask function', (done) => {
        try {
          assert.equal(true, typeof a.createChangeRequestTask === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing changeId', (done) => {
        try {
          a.createChangeRequestTask('fakeparam', null, (data, error) => {
            try {
              const displayE = 'changeId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-createChangeRequestTask', displayE);
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
      it('should have a deleteChangeTaskByTaskId function', (done) => {
        try {
          assert.equal(true, typeof a.deleteChangeTaskByTaskId === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing changeId', (done) => {
        try {
          a.deleteChangeTaskByTaskId('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'changeId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-deleteChangeTaskByTaskId', displayE);
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
      it('should error if - missing taskId', (done) => {
        try {
          a.deleteChangeTaskByTaskId('fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'taskId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-deleteChangeTaskByTaskId', displayE);
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
      it('should have a getChangeRequestConflict function', (done) => {
        try {
          assert.equal(true, typeof a.getChangeRequestConflict === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing changeId', (done) => {
        try {
          a.getChangeRequestConflict('fakeparam', null, (data, error) => {
            try {
              const displayE = 'changeId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getChangeRequestConflict', displayE);
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
      it('should have a createChangeRequestConflict function', (done) => {
        try {
          assert.equal(true, typeof a.createChangeRequestConflict === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing changeId', (done) => {
        try {
          a.createChangeRequestConflict('fakeparam', null, (data, error) => {
            try {
              const displayE = 'changeId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-createChangeRequestConflict', displayE);
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

    describe('#cancelChangeRequestConflict - errors', () => {
      it('should have a cancelChangeRequestConflict function', (done) => {
        try {
          assert.equal(true, typeof a.cancelChangeRequestConflict === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing changeId', (done) => {
        try {
          a.cancelChangeRequestConflict('fakeparam', null, (data, error) => {
            try {
              const displayE = 'changeId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-cancelChangeRequestConflict', displayE);
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

    describe('#importIntoTable - errors', () => {
      it('should have a importIntoTable function', (done) => {
        try {
          assert.equal(true, typeof a.importIntoTable === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing tableName', (done) => {
        try {
          a.importIntoTable(null, null, (data, error) => {
            try {
              const displayE = 'tableName is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-importIntoTable', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.importIntoTable('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-importIntoTable', displayE);
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
      it('should have a getImportById function', (done) => {
        try {
          assert.equal(true, typeof a.getImportById === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing tableName', (done) => {
        try {
          a.getImportById(null, null, (data, error) => {
            try {
              const displayE = 'tableName is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getImportById', displayE);
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
      it('should error if - missing importId', (done) => {
        try {
          a.getImportById('fakeparam', null, (data, error) => {
            try {
              const displayE = 'importId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getImportById', displayE);
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
      it('should have a getApplicationById function', (done) => {
        try {
          assert.equal(true, typeof a.getApplicationById === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing appId', (done) => {
        try {
          a.getApplicationById(null, (data, error) => {
            try {
              const displayE = 'appId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getApplicationById', displayE);
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

    describe('#createApplication - errors', () => {
      it('should have a createApplication function', (done) => {
        try {
          assert.equal(true, typeof a.createApplication === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createApplication(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-createApplication', displayE);
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
      it('should have a getEmail function', (done) => {
        try {
          assert.equal(true, typeof a.getEmail === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing emailId', (done) => {
        try {
          a.getEmail(null, (data, error) => {
            try {
              const displayE = 'emailId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getEmail', displayE);
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

    describe('#createEmail - errors', () => {
      it('should have a createEmail function', (done) => {
        try {
          assert.equal(true, typeof a.createEmail === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createEmail(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-createEmail', displayE);
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

    describe('#pushInstallation - errors', () => {
      it('should have a pushInstallation function', (done) => {
        try {
          assert.equal(true, typeof a.pushInstallation === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing pushApplicationName', (done) => {
        try {
          a.pushInstallation(null, null, (data, error) => {
            try {
              const displayE = 'pushApplicationName is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-pushInstallation', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.pushInstallation('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-pushInstallation', displayE);
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

    describe('#removeInstallation - errors', () => {
      it('should have a removeInstallation function', (done) => {
        try {
          assert.equal(true, typeof a.removeInstallation === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing pushApplicationName', (done) => {
        try {
          a.removeInstallation(null, null, (data, error) => {
            try {
              const displayE = 'pushApplicationName is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-removeInstallation', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.removeInstallation('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-removeInstallation', displayE);
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

    describe('#getMetricBase - errors', () => {
      it('should have a getMetricBase function', (done) => {
        try {
          assert.equal(true, typeof a.getMetricBase === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing table', (done) => {
        try {
          a.getMetricBase(null, null, null, null, null, (data, error) => {
            try {
              const displayE = 'table is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getMetricBase', displayE);
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
      it('should error if - missing subject', (done) => {
        try {
          a.getMetricBase('fakeparam', null, null, null, null, (data, error) => {
            try {
              const displayE = 'subject is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getMetricBase', displayE);
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
      it('should error if - missing metric', (done) => {
        try {
          a.getMetricBase('fakeparam', 'fakeparam', null, null, null, (data, error) => {
            try {
              const displayE = 'metric is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getMetricBase', displayE);
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
      it('should error if - missing sysparmEnd', (done) => {
        try {
          a.getMetricBase('fakeparam', 'fakeparam', 'fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'sysparmEnd is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getMetricBase', displayE);
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
      it('should error if - missing sysparmStart', (done) => {
        try {
          a.getMetricBase('fakeparam', 'fakeparam', 'fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'sysparmStart is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getMetricBase', displayE);
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

    describe('#createMetricBase - errors', () => {
      it('should have a createMetricBase function', (done) => {
        try {
          assert.equal(true, typeof a.createMetricBase === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createMetricBase(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-createMetricBase', displayE);
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
      it('should have a transformMetricBase function', (done) => {
        try {
          assert.equal(true, typeof a.transformMetricBase === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing table', (done) => {
        try {
          a.transformMetricBase(null, null, null, null, (data, error) => {
            try {
              const displayE = 'table is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-transformMetricBase', displayE);
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
      it('should error if - missing metric', (done) => {
        try {
          a.transformMetricBase('fakeparam', null, null, null, (data, error) => {
            try {
              const displayE = 'metric is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-transformMetricBase', displayE);
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
      it('should error if - missing sysparmEnd', (done) => {
        try {
          a.transformMetricBase('fakeparam', 'fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'sysparmEnd is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-transformMetricBase', displayE);
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
      it('should error if - missing sysparmStart', (done) => {
        try {
          a.transformMetricBase('fakeparam', 'fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'sysparmStart is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-transformMetricBase', displayE);
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

    describe('#getAggregate - errors', () => {
      it('should have a getAggregate function', (done) => {
        try {
          assert.equal(true, typeof a.getAggregate === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing sysparmQuery', (done) => {
        try {
          a.getAggregate(null, null, null, (data, error) => {
            try {
              const displayE = 'sysparmQuery is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getAggregate', displayE);
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
      it('should error if - missing tableName', (done) => {
        try {
          a.getAggregate('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'tableName is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getAggregate', displayE);
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
      it('should error if - missing aggregate', (done) => {
        try {
          a.getAggregate('fakeparam', 'active=true', null, (data, error) => {
            try {
              const displayE = 'aggregate is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getAggregate', displayE);
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

    describe('#createQueue - errors', () => {
      it('should have a createQueue function', (done) => {
        try {
          assert.equal(true, typeof a.createQueue === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing queueId', (done) => {
        try {
          a.createQueue(null, null, (data, error) => {
            try {
              const displayE = 'queueId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-createQueue', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.createQueue('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-createQueue', displayE);
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
      it('should have a getUserRoles function', (done) => {
        try {
          assert.equal(true, typeof a.getUserRoles === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing userId', (done) => {
        try {
          a.getUserRoles(null, (data, error) => {
            try {
              const displayE = 'userId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getUserRoles', displayE);
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

    describe('#getPerformanceAnalytics - errors', () => {
      it('should have a getPerformanceAnalytics function', (done) => {
        try {
          assert.equal(true, typeof a.getPerformanceAnalytics === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing sysparmUuid', (done) => {
        try {
          a.getPerformanceAnalytics(null, (data, error) => {
            try {
              const displayE = 'sysparmUuid is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getPerformanceAnalytics', displayE);
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
      it('should have a getChannelsForTable function', (done) => {
        try {
          assert.equal(true, typeof a.getChannelsForTable === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing sysparmTable', (done) => {
        try {
          a.getChannelsForTable(null, (data, error) => {
            try {
              const displayE = 'sysparmTable is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getChannelsForTable', displayE);
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
      it('should have a getChannelsForTableByTaskId function', (done) => {
        try {
          assert.equal(true, typeof a.getChannelsForTableByTaskId === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing commTaskId', (done) => {
        try {
          a.getChannelsForTableByTaskId(null, null, (data, error) => {
            try {
              const displayE = 'commTaskId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getChannelsForTableByTaskId', displayE);
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
      it('should error if - missing table', (done) => {
        try {
          a.getChannelsForTableByTaskId('fakeparam', null, (data, error) => {
            try {
              const displayE = 'table is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getChannelsForTableByTaskId', displayE);
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

    describe('#getCommunicationGroupPlans - errors', () => {
      it('should have a getCommunicationGroupPlans function', (done) => {
        try {
          assert.equal(true, typeof a.getCommunicationGroupPlans === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing taskId', (done) => {
        try {
          a.getCommunicationGroupPlans(null, (data, error) => {
            try {
              const displayE = 'taskId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getCommunicationGroupPlans', displayE);
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
      it('should have a getCommunicationPlans function', (done) => {
        try {
          assert.equal(true, typeof a.getCommunicationPlans === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing taskId', (done) => {
        try {
          a.getCommunicationPlans(null, (data, error) => {
            try {
              const displayE = 'taskId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getCommunicationPlans', displayE);
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

    describe('#manageCommunicationRecipients - errors', () => {
      it('should have a manageCommunicationRecipients function', (done) => {
        try {
          assert.equal(true, typeof a.manageCommunicationRecipients === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing sysparmTable', (done) => {
        try {
          a.manageCommunicationRecipients(null, null, null, (data, error) => {
            try {
              const displayE = 'sysparmTable is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-manageCommunicationRecipients', displayE);
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
      it('should error if - missing commPlanId', (done) => {
        try {
          a.manageCommunicationRecipients('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'commPlanId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-manageCommunicationRecipients', displayE);
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

    describe('#createCommunicationPlan - errors', () => {
      it('should have a createCommunicationPlan function', (done) => {
        try {
          assert.equal(true, typeof a.createCommunicationPlan === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing sysparmTable', (done) => {
        try {
          a.createCommunicationPlan(null, null, (data, error) => {
            try {
              const displayE = 'sysparmTable is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-createCommunicationPlan', displayE);
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

    describe('#getCommunicationTaskState - errors', () => {
      it('should have a getCommunicationTaskState function', (done) => {
        try {
          assert.equal(true, typeof a.getCommunicationTaskState === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing commTaskId', (done) => {
        try {
          a.getCommunicationTaskState(null, null, null, (data, error) => {
            try {
              const displayE = 'commTaskId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getCommunicationTaskState', displayE);
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
      it('should error if - missing table', (done) => {
        try {
          a.getCommunicationTaskState('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'table is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getCommunicationTaskState', displayE);
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

    describe('#createCommunicationTask - errors', () => {
      it('should have a createCommunicationTask function', (done) => {
        try {
          assert.equal(true, typeof a.createCommunicationTask === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing sysparmTable', (done) => {
        try {
          a.createCommunicationTask(null, null, (data, error) => {
            try {
              const displayE = 'sysparmTable is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-createCommunicationTask', displayE);
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

    describe('#updateCommunicationTask - errors', () => {
      it('should have a updateCommunicationTask function', (done) => {
        try {
          assert.equal(true, typeof a.updateCommunicationTask === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing commTaskId', (done) => {
        try {
          a.updateCommunicationTask(null, null, null, (data, error) => {
            try {
              const displayE = 'commTaskId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-updateCommunicationTask', displayE);
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
      it('should error if - missing table', (done) => {
        try {
          a.updateCommunicationTask('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'table is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-updateCommunicationTask', displayE);
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
      it('should have a getAttachmentMetadataById function', (done) => {
        try {
          assert.equal(true, typeof a.getAttachmentMetadataById === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing attachId', (done) => {
        try {
          a.getAttachmentMetadataById(null, (data, error) => {
            try {
              const displayE = 'attachId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getAttachmentMetadataById', displayE);
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
      it('should have a getAttachmentBinaryById function', (done) => {
        try {
          assert.equal(true, typeof a.getAttachmentBinaryById === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing attachId', (done) => {
        try {
          a.getAttachmentBinaryById(null, (data, error) => {
            try {
              const displayE = 'attachId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getAttachmentBinaryById', displayE);
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
      it('should have a getAttachmentsMetadata function', (done) => {
        try {
          assert.equal(true, typeof a.getAttachmentsMetadata === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#uploadAttachment - errors', () => {
      it('should have a uploadAttachment function', (done) => {
        try {
          assert.equal(true, typeof a.uploadAttachment === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing fileName', (done) => {
        try {
          a.uploadAttachment('fakeparam', null, null, null, null, (data, error) => {
            try {
              const displayE = 'fileName is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-uploadAttachment', displayE);
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
      it('should error if - missing tableName', (done) => {
        try {
          a.uploadAttachment('fakeparam', 'fakeparam', null, null, null, (data, error) => {
            try {
              const displayE = 'tableName is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-uploadAttachment', displayE);
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
      it('should error if - missing tableId', (done) => {
        try {
          a.uploadAttachment('fakeparam', 'fakeparam', 'fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'tableId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-uploadAttachment', displayE);
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
      it('should error if - missing bodyFormData', (done) => {
        try {
          a.uploadAttachment('fakeparam', 'fakeparam', 'fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'bodyFormData is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-uploadAttachment', displayE);
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

    describe('#uploadMultipartAttachment - errors', () => {
      it('should have a uploadMultipartAttachment function', (done) => {
        try {
          assert.equal(true, typeof a.uploadMultipartAttachment === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing bodyFormData', (done) => {
        try {
          a.uploadMultipartAttachment(null, (data, error) => {
            try {
              const displayE = 'bodyFormData is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-uploadMultipartAttachment', displayE);
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
      it('should have a deleteAttachmentById function', (done) => {
        try {
          assert.equal(true, typeof a.deleteAttachmentById === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing attachId', (done) => {
        try {
          a.deleteAttachmentById(null, (data, error) => {
            try {
              const displayE = 'attachId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-deleteAttachmentById', displayE);
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

    describe('#getCSMAccount - errors', () => {
      it('should have a getCSMAccount function', (done) => {
        try {
          assert.equal(true, typeof a.getCSMAccount === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getCSMAccount(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getCSMAccount', displayE);
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

    describe('#queryCSMAccounts - errors', () => {
      it('should have a queryCSMAccounts function', (done) => {
        try {
          assert.equal(true, typeof a.queryCSMAccounts === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing sysparmQuery', (done) => {
        try {
          a.queryCSMAccounts(null, (data, error) => {
            try {
              const displayE = 'sysparmQuery is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-queryCSMAccounts', displayE);
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

    describe('#getCSMCase - errors', () => {
      it('should have a getCSMCase function', (done) => {
        try {
          assert.equal(true, typeof a.getCSMCase === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getCSMCase(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getCSMCase', displayE);
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

    describe('#queryCSMCases - errors', () => {
      it('should have a queryCSMCases function', (done) => {
        try {
          assert.equal(true, typeof a.queryCSMCases === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing sysparmQuery', (done) => {
        try {
          a.queryCSMCases(null, (data, error) => {
            try {
              const displayE = 'sysparmQuery is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-queryCSMCases', displayE);
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

    describe('#createCSMCase - errors', () => {
      it('should have a createCSMCase function', (done) => {
        try {
          assert.equal(true, typeof a.createCSMCase === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing sysparmQuery', (done) => {
        try {
          a.createCSMCase(null, null, (data, error) => {
            try {
              const displayE = 'sysparmQuery is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-createCSMCase', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.createCSMCase('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-createCSMCase', displayE);
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

    describe('#updateCSMCase - errors', () => {
      it('should have a updateCSMCase function', (done) => {
        try {
          assert.equal(true, typeof a.updateCSMCase === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.updateCSMCase(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-updateCSMCase', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.updateCSMCase('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-updateCSMCase', displayE);
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

    describe('#getCSMConsumer - errors', () => {
      it('should have a getCSMConsumer function', (done) => {
        try {
          assert.equal(true, typeof a.getCSMConsumer === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getCSMConsumer(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getCSMConsumer', displayE);
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

    describe('#queryCSMConsumers - errors', () => {
      it('should have a queryCSMConsumers function', (done) => {
        try {
          assert.equal(true, typeof a.queryCSMConsumers === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing sysparmQuery', (done) => {
        try {
          a.queryCSMConsumers(null, (data, error) => {
            try {
              const displayE = 'sysparmQuery is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-queryCSMConsumers', displayE);
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

    describe('#createCSMConsumer - errors', () => {
      it('should have a createCSMConsumer function', (done) => {
        try {
          assert.equal(true, typeof a.createCSMConsumer === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createCSMConsumer('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-createCSMConsumer', displayE);
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

    describe('#getCSMContact - errors', () => {
      it('should have a getCSMContact function', (done) => {
        try {
          assert.equal(true, typeof a.getCSMContact === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getCSMContact(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getCSMContact', displayE);
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

    describe('#queryCSMContacts - errors', () => {
      it('should have a queryCSMContacts function', (done) => {
        try {
          assert.equal(true, typeof a.queryCSMContacts === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing sysparmQuery', (done) => {
        try {
          a.queryCSMContacts(null, (data, error) => {
            try {
              const displayE = 'sysparmQuery is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-queryCSMContacts', displayE);
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

    describe('#createCSMContact - errors', () => {
      it('should have a createCSMContact function', (done) => {
        try {
          assert.equal(true, typeof a.createCSMContact === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing sysparmQuery', (done) => {
        try {
          a.createCSMContact(null, null, (data, error) => {
            try {
              const displayE = 'sysparmQuery is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-createCSMContact', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.createCSMContact('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-createCSMContact', displayE);
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

    describe('#getServiceCatalogs - errors', () => {
      it('should have a getServiceCatalogs function', (done) => {
        try {
          assert.equal(true, typeof a.getServiceCatalogs === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing sysparmLimit', (done) => {
        try {
          a.getServiceCatalogs(null, (data, error) => {
            try {
              const displayE = 'sysparmLimit is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getServiceCatalogs', displayE);
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
      it('should have a getServiceCatalogById function', (done) => {
        try {
          assert.equal(true, typeof a.getServiceCatalogById === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing sysparmLimit', (done) => {
        try {
          a.getServiceCatalogById(null, null, (data, error) => {
            try {
              const displayE = 'sysparmLimit is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getServiceCatalogById', displayE);
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
      it('should error if - missing catalogId', (done) => {
        try {
          a.getServiceCatalogById('fakeparam', null, (data, error) => {
            try {
              const displayE = 'catalogId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getServiceCatalogById', displayE);
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
      it('should have a getServiceCatalogCategoryInformation function', (done) => {
        try {
          assert.equal(true, typeof a.getServiceCatalogCategoryInformation === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing sysparmLimit', (done) => {
        try {
          a.getServiceCatalogCategoryInformation(null, null, (data, error) => {
            try {
              const displayE = 'sysparmLimit is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getServiceCatalogCategoryInformation', displayE);
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
      it('should error if - missing catalogId', (done) => {
        try {
          a.getServiceCatalogCategoryInformation('fakeparam', null, (data, error) => {
            try {
              const displayE = 'catalogId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getServiceCatalogCategoryInformation', displayE);
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
      it('should have a getServiceCatalogCategories function', (done) => {
        try {
          assert.equal(true, typeof a.getServiceCatalogCategories === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing sysparmLimit', (done) => {
        try {
          a.getServiceCatalogCategories(null, null, (data, error) => {
            try {
              const displayE = 'sysparmLimit is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getServiceCatalogCategories', displayE);
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
      it('should error if - missing catalogId', (done) => {
        try {
          a.getServiceCatalogCategories('fakeparam', null, (data, error) => {
            try {
              const displayE = 'catalogId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getServiceCatalogCategories', displayE);
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
      it('should have a getServiceCatalogItems function', (done) => {
        try {
          assert.equal(true, typeof a.getServiceCatalogItems === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing sysparmLimit', (done) => {
        try {
          a.getServiceCatalogItems(null, null, null, (data, error) => {
            try {
              const displayE = 'sysparmLimit is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getServiceCatalogItems', displayE);
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
      it('should have a getServiceCatalogItemById function', (done) => {
        try {
          assert.equal(true, typeof a.getServiceCatalogItemById === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing sysparmLimit', (done) => {
        try {
          a.getServiceCatalogItemById(null, null, (data, error) => {
            try {
              const displayE = 'sysparmLimit is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getServiceCatalogItemById', displayE);
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
      it('should error if - missing catalogId', (done) => {
        try {
          a.getServiceCatalogItemById('fakeparam', null, (data, error) => {
            try {
              const displayE = 'catalogId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getServiceCatalogItemById', displayE);
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
      it('should have a addItemToCart function', (done) => {
        try {
          assert.equal(true, typeof a.addItemToCart === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing itemId', (done) => {
        try {
          a.addItemToCart(null, null, (data, error) => {
            try {
              const displayE = 'itemId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-addItemToCart', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.addItemToCart('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-addItemToCart', displayE);
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
      it('should have a getServiceCatalogOrderItems function', (done) => {
        try {
          assert.equal(true, typeof a.getServiceCatalogOrderItems === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing itemId', (done) => {
        try {
          a.getServiceCatalogOrderItems(null, null, (data, error) => {
            try {
              const displayE = 'itemId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getServiceCatalogOrderItems', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.getServiceCatalogOrderItems('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getServiceCatalogOrderItems', displayE);
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

    describe('#createServiceCatalogRecordGuide - errors', () => {
      it('should have a createServiceCatalogRecordGuide function', (done) => {
        try {
          assert.equal(true, typeof a.createServiceCatalogRecordGuide === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing itemId', (done) => {
        try {
          a.createServiceCatalogRecordGuide(null, null, (data, error) => {
            try {
              const displayE = 'itemId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-createServiceCatalogRecordGuide', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.createServiceCatalogRecordGuide('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-createServiceCatalogRecordGuide', displayE);
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
      it('should have a getServiceCatalogCheckoutInformation function', (done) => {
        try {
          assert.equal(true, typeof a.getServiceCatalogCheckoutInformation === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing itemId', (done) => {
        try {
          a.getServiceCatalogCheckoutInformation(null, null, (data, error) => {
            try {
              const displayE = 'itemId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getServiceCatalogCheckoutInformation', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.getServiceCatalogCheckoutInformation('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getServiceCatalogCheckoutInformation', displayE);
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

    describe('#orderNowServiceCatalog - errors', () => {
      it('should have a orderNowServiceCatalog function', (done) => {
        try {
          assert.equal(true, typeof a.orderNowServiceCatalog === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing itemId', (done) => {
        try {
          a.orderNowServiceCatalog(null, null, (data, error) => {
            try {
              const displayE = 'itemId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-orderNowServiceCatalog', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.orderNowServiceCatalog('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-orderNowServiceCatalog', displayE);
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
      it('should have a getServiceCatalogCart function', (done) => {
        try {
          assert.equal(true, typeof a.getServiceCatalogCart === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getServiceCatalogUserDeliveryAddress - errors', () => {
      it('should have a getServiceCatalogUserDeliveryAddress function', (done) => {
        try {
          assert.equal(true, typeof a.getServiceCatalogUserDeliveryAddress === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing userId', (done) => {
        try {
          a.getServiceCatalogUserDeliveryAddress(null, (data, error) => {
            try {
              const displayE = 'userId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getServiceCatalogUserDeliveryAddress', displayE);
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
      it('should have a updateServiceCatalogCart function', (done) => {
        try {
          assert.equal(true, typeof a.updateServiceCatalogCart === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing cartItemId', (done) => {
        try {
          a.updateServiceCatalogCart(null, null, (data, error) => {
            try {
              const displayE = 'cartItemId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-updateServiceCatalogCart', displayE);
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
      it('should error if - missing bodyFormData', (done) => {
        try {
          a.updateServiceCatalogCart('fakeparam', null, (data, error) => {
            try {
              const displayE = 'bodyFormData is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-updateServiceCatalogCart', displayE);
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
      it('should have a deleteServiceCatalogCartItems function', (done) => {
        try {
          assert.equal(true, typeof a.deleteServiceCatalogCartItems === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing cartItemId', (done) => {
        try {
          a.deleteServiceCatalogCartItems(null, (data, error) => {
            try {
              const displayE = 'cartItemId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-deleteServiceCatalogCartItems', displayE);
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
      it('should have a getServiceCatalogDisplayVariable function', (done) => {
        try {
          assert.equal(true, typeof a.getServiceCatalogDisplayVariable === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing itemId', (done) => {
        try {
          a.getServiceCatalogDisplayVariable(null, null, (data, error) => {
            try {
              const displayE = 'itemId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getServiceCatalogDisplayVariable', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.getServiceCatalogDisplayVariable('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getServiceCatalogDisplayVariable', displayE);
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
      it('should have a deleteServiceCatalogCart function', (done) => {
        try {
          assert.equal(true, typeof a.deleteServiceCatalogCart === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing cartId', (done) => {
        try {
          a.deleteServiceCatalogCart(null, (data, error) => {
            try {
              const displayE = 'cartId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-deleteServiceCatalogCart', displayE);
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
      it('should have a checkoutCartServiceCatalog function', (done) => {
        try {
          assert.equal(true, typeof a.checkoutCartServiceCatalog === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#submitOrderServiceCatalog - errors', () => {
      it('should have a submitOrderServiceCatalog function', (done) => {
        try {
          assert.equal(true, typeof a.submitOrderServiceCatalog === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getChangeRequests - errors', () => {
      it('should have a getChangeRequests function', (done) => {
        try {
          assert.equal(true, typeof a.getChangeRequests === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getChangeRequestById - errors', () => {
      it('should have a getChangeRequestById function', (done) => {
        try {
          assert.equal(true, typeof a.getChangeRequestById === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing changeId', (done) => {
        try {
          a.getChangeRequestById(null, (data, error) => {
            try {
              const displayE = 'changeId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getChangeRequestById', displayE);
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

    describe('#createChangeRequest - errors', () => {
      it('should have a createChangeRequest function', (done) => {
        try {
          assert.equal(true, typeof a.createChangeRequest === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createChangeRequest(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-createChangeRequest', displayE);
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
      it('should error on create a change request - no summary', (done) => {
        try {
          const body = { blah: 'bad body' };
          a.createChangeRequest(body, (data, error) => {
            try {
              const displayE = 'Schema validation failed on must have required property \'summary\'';
              runErrorAsserts(data, error, 'AD.312', 'Test-servicenow-translatorUtil-buildJSONEntity', displayE);
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
      it('should have a updateChangeRequest function', (done) => {
        try {
          assert.equal(true, typeof a.updateChangeRequest === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing changeId', (done) => {
        try {
          a.updateChangeRequest(null, null, (data, error) => {
            try {
              const displayE = 'changeId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-updateChangeRequest', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.updateChangeRequest('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-updateChangeRequest', displayE);
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
      it('should have a deleteChangeRequest function', (done) => {
        try {
          assert.equal(true, typeof a.deleteChangeRequest === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing changeId', (done) => {
        try {
          a.deleteChangeRequest(null, (data, error) => {
            try {
              const displayE = 'changeId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-deleteChangeRequest', displayE);
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

    describe('#getIncidentById - errors', () => {
      it('should have a getIncidentById function', (done) => {
        try {
          assert.equal(true, typeof a.getIncidentById === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing incidentId', (done) => {
        try {
          a.getIncidentById(null, (data, error) => {
            try {
              const displayE = 'incidentId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getIncidentById', displayE);
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
      it('should have a getIncidents function', (done) => {
        try {
          assert.equal(true, typeof a.getIncidents === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createIncident - errors', () => {
      it('should have a createIncident function', (done) => {
        try {
          assert.equal(true, typeof a.createIncident === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createIncident(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-createIncident', displayE);
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
      it('should error on create a incident - no summary', (done) => {
        try {
          const body = { blah: 'bad body' };
          a.createIncident(body, (data, error) => {
            try {
              const displayE = 'Schema validation failed on must have required property \'summary\'';
              runErrorAsserts(data, error, 'AD.312', 'Test-servicenow-translatorUtil-buildJSONEntity', displayE);
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
      it('should have a updateIncident function', (done) => {
        try {
          assert.equal(true, typeof a.updateIncident === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing incidentId', (done) => {
        try {
          a.updateIncident(null, null, (data, error) => {
            try {
              const displayE = 'incidentId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-updateIncident', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.updateIncident('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-updateIncident', displayE);
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
      it('should have a deleteIncident function', (done) => {
        try {
          assert.equal(true, typeof a.deleteIncident === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing incidentId', (done) => {
        try {
          a.deleteIncident(null, (data, error) => {
            try {
              const displayE = 'incidentId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-deleteIncident', displayE);
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
      it('should have a getGroupById function', (done) => {
        try {
          assert.equal(true, typeof a.getGroupById === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing groupId', (done) => {
        try {
          a.getGroupById(null, (data, error) => {
            try {
              const displayE = 'groupId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getGroupById', displayE);
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
      it('should have a getGroups function', (done) => {
        try {
          assert.equal(true, typeof a.getGroups === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createGroup - errors', () => {
      it('should have a createGroup function', (done) => {
        try {
          assert.equal(true, typeof a.createGroup === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createGroup(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-createGroup', displayE);
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
      it('should error on create a group - no name', (done) => {
        try {
          const body = { blah: 'bad body' };
          a.createGroup(body, (data, error) => {
            try {
              const displayE = 'Schema validation failed on must have required property \'name\'';
              runErrorAsserts(data, error, 'AD.312', 'Test-servicenow-translatorUtil-buildJSONEntity', displayE);
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
      it('should have a updateGroup function', (done) => {
        try {
          assert.equal(true, typeof a.updateGroup === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing groupId', (done) => {
        try {
          a.updateGroup(null, null, (data, error) => {
            try {
              const displayE = 'groupId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-updateGroup', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.updateGroup('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-updateGroup', displayE);
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
      it('should have a deleteGroup function', (done) => {
        try {
          assert.equal(true, typeof a.deleteGroup === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing groupId', (done) => {
        try {
          a.deleteGroup(null, (data, error) => {
            try {
              const displayE = 'groupId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-deleteGroup', displayE);
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
      it('should have a getConfigItemById function', (done) => {
        try {
          assert.equal(true, typeof a.getConfigItemById === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing itemId', (done) => {
        try {
          a.getConfigItemById(null, (data, error) => {
            try {
              const displayE = 'itemId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getConfigItemById', displayE);
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
      it('should have a getConfigItems function', (done) => {
        try {
          assert.equal(true, typeof a.getConfigItems === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createConfigItem - errors', () => {
      it('should have a createConfigItem function', (done) => {
        try {
          assert.equal(true, typeof a.createConfigItem === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createConfigItem(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-createConfigItem', displayE);
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
      it('should error on create a config item - no name', (done) => {
        try {
          const body = { blah: 'bad body' };
          a.createConfigItem(body, (data, error) => {
            try {
              const displayE = 'Schema validation failed on must have required property \'name\'';
              runErrorAsserts(data, error, 'AD.312', 'Test-servicenow-translatorUtil-buildJSONEntity', displayE);
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
      it('should have a updateConfigItem function', (done) => {
        try {
          assert.equal(true, typeof a.updateConfigItem === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing itemId', (done) => {
        try {
          a.updateConfigItem(null, null, (data, error) => {
            try {
              const displayE = 'itemId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-updateConfigItem', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.updateConfigItem('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-updateConfigItem', displayE);
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
      it('should have a deleteConfigItem function', (done) => {
        try {
          assert.equal(true, typeof a.deleteConfigItem === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing itemId', (done) => {
        try {
          a.deleteConfigItem(null, (data, error) => {
            try {
              const displayE = 'itemId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-deleteConfigItem', displayE);
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
      it('should have a getArticleById function', (done) => {
        try {
          assert.equal(true, typeof a.getArticleById === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing articleId', (done) => {
        try {
          a.getArticleById(null, (data, error) => {
            try {
              const displayE = 'articleId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getArticleById', displayE);
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
      it('should have a getArticles function', (done) => {
        try {
          assert.equal(true, typeof a.getArticles === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createArticle - errors', () => {
      it('should have a createArticle function', (done) => {
        try {
          assert.equal(true, typeof a.createArticle === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createArticle(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-createArticle', displayE);
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
      it('should error on create an article - no summary', (done) => {
        try {
          const body = { blah: 'bad body' };
          a.createArticle(body, (data, error) => {
            try {
              const displayE = 'Schema validation failed on must have required property \'summary\'';
              runErrorAsserts(data, error, 'AD.312', 'Test-servicenow-translatorUtil-buildJSONEntity', displayE);
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
      it('should have a updateArticle function', (done) => {
        try {
          assert.equal(true, typeof a.updateArticle === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing articleId', (done) => {
        try {
          a.updateArticle(null, null, (data, error) => {
            try {
              const displayE = 'articleId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-updateArticle', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.updateArticle('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-updateArticle', displayE);
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
      it('should have a deleteArticle function', (done) => {
        try {
          assert.equal(true, typeof a.deleteArticle === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing articleId', (done) => {
        try {
          a.deleteArticle(null, (data, error) => {
            try {
              const displayE = 'articleId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-deleteArticle', displayE);
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
      it('should have a getProblemById function', (done) => {
        try {
          assert.equal(true, typeof a.getProblemById === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing problemId', (done) => {
        try {
          a.getProblemById(null, (data, error) => {
            try {
              const displayE = 'problemId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getProblemById', displayE);
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
      it('should have a getProblems function', (done) => {
        try {
          assert.equal(true, typeof a.getProblems === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createProblem - errors', () => {
      it('should have a createProblem function', (done) => {
        try {
          assert.equal(true, typeof a.createProblem === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createProblem(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-createProblem', displayE);
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
      it('should error on create a problem - no summary', (done) => {
        try {
          const body = { blah: 'bad body' };
          a.createProblem(body, (data, error) => {
            try {
              const displayE = 'Schema validation failed on must have required property \'summary\'';
              runErrorAsserts(data, error, 'AD.312', 'Test-servicenow-translatorUtil-buildJSONEntity', displayE);
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
      it('should have a updateProblem function', (done) => {
        try {
          assert.equal(true, typeof a.updateProblem === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing problemId', (done) => {
        try {
          a.updateProblem(null, null, (data, error) => {
            try {
              const displayE = 'problemId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-updateProblem', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.updateProblem('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-updateProblem', displayE);
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
      it('should have a deleteProblem function', (done) => {
        try {
          assert.equal(true, typeof a.deleteProblem === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing problemId', (done) => {
        try {
          a.deleteProblem(null, (data, error) => {
            try {
              const displayE = 'problemId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-deleteProblem', displayE);
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
      it('should have a getRequestsById function', (done) => {
        try {
          assert.equal(true, typeof a.getRequestsById === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing requestId', (done) => {
        try {
          a.getRequestsById(null, (data, error) => {
            try {
              const displayE = 'requestId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getRequestsById', displayE);
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
      it('should have a getRequests function', (done) => {
        try {
          assert.equal(true, typeof a.getRequests === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createRequests - errors', () => {
      it('should have a createRequests function', (done) => {
        try {
          assert.equal(true, typeof a.createRequests === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createRequests(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-createRequests', displayE);
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
      it('should error on create a request - no summary', (done) => {
        try {
          const body = { blah: 'bad body' };
          a.createRequests(body, (data, error) => {
            try {
              const displayE = 'Schema validation failed on must have required property \'summary\'';
              runErrorAsserts(data, error, 'AD.312', 'Test-servicenow-translatorUtil-buildJSONEntity', displayE);
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
      it('should have a updateRequests function', (done) => {
        try {
          assert.equal(true, typeof a.updateRequests === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing requestId', (done) => {
        try {
          a.updateRequests(null, null, (data, error) => {
            try {
              const displayE = 'requestId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-updateRequests', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.updateRequests('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-updateRequests', displayE);
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
      it('should have a deleteRequests function', (done) => {
        try {
          assert.equal(true, typeof a.deleteRequests === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing requestId', (done) => {
        try {
          a.deleteRequests(null, (data, error) => {
            try {
              const displayE = 'requestId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-deleteRequests', displayE);
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
      it('should have a getRequestItemsById function', (done) => {
        try {
          assert.equal(true, typeof a.getRequestItemsById === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing itemId', (done) => {
        try {
          a.getRequestItemsById(null, (data, error) => {
            try {
              const displayE = 'itemId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getRequestItemsById', displayE);
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
      it('should have a getRequestItems function', (done) => {
        try {
          assert.equal(true, typeof a.getRequestItems === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createRequestItems - errors', () => {
      it('should have a createRequestItems function', (done) => {
        try {
          assert.equal(true, typeof a.createRequestItems === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createRequestItems(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-createRequestItems', displayE);
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
      it('should error on create a request item - no summary', (done) => {
        try {
          const body = { blah: 'bad body' };
          a.createRequestItems(body, (data, error) => {
            try {
              const displayE = 'Schema validation failed on must have required property \'summary\'';
              runErrorAsserts(data, error, 'AD.312', 'Test-servicenow-translatorUtil-buildJSONEntity', displayE);
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
      it('should have a updateRequestItems function', (done) => {
        try {
          assert.equal(true, typeof a.updateRequestItems === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing itemId', (done) => {
        try {
          a.updateRequestItems(null, null, (data, error) => {
            try {
              const displayE = 'itemId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-updateRequestItems', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.updateRequestItems('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-updateRequestItems', displayE);
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
      it('should have a deleteRequestItems function', (done) => {
        try {
          assert.equal(true, typeof a.deleteRequestItems === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing itemId', (done) => {
        try {
          a.deleteRequestItems(null, (data, error) => {
            try {
              const displayE = 'itemId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-deleteRequestItems', displayE);
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
      it('should have a getUsersById function', (done) => {
        try {
          assert.equal(true, typeof a.getUsersById === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing userId', (done) => {
        try {
          a.getUsersById(null, (data, error) => {
            try {
              const displayE = 'userId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getUsersById', displayE);
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
      it('should have a getUsers function', (done) => {
        try {
          assert.equal(true, typeof a.getUsers === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createUsers - errors', () => {
      it('should have a createUsers function', (done) => {
        try {
          assert.equal(true, typeof a.createUsers === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createUsers(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-createUsers', displayE);
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
      it('should error on create a user - no username', (done) => {
        try {
          const ubody = { password: 'badbody' };
          a.createUsers(ubody, (data, error) => {
            try {
              const displayE = 'Schema validation failed on must have required property \'username\'';
              runErrorAsserts(data, error, 'AD.312', 'Test-servicenow-translatorUtil-buildJSONEntity', displayE);
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
      it('should error on create a user - no password', (done) => {
        try {
          const pbody = { username: 'badbody' };
          a.createUsers(pbody, (data, error) => {
            try {
              const displayE = 'Schema validation failed on must have required property \'password\'';
              runErrorAsserts(data, error, 'AD.312', 'Test-servicenow-translatorUtil-buildJSONEntity', displayE);
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
      it('should have a updateUsers function', (done) => {
        try {
          assert.equal(true, typeof a.updateUsers === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing userId', (done) => {
        try {
          a.updateUsers(null, null, (data, error) => {
            try {
              const displayE = 'userId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-updateUsers', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.updateUsers('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-updateUsers', displayE);
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
      it('should have a deleteUsers function', (done) => {
        try {
          assert.equal(true, typeof a.deleteUsers === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing userId', (done) => {
        try {
          a.deleteUsers(null, (data, error) => {
            try {
              const displayE = 'userId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-deleteUsers', displayE);
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

    describe('#getMajorIncident - errors', () => {
      it('should have a getMajorIncident function', (done) => {
        try {
          assert.equal(true, typeof a.getMajorIncident === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing incidentId', (done) => {
        try {
          a.getMajorIncident(null, (data, error) => {
            try {
              const displayE = 'incidentId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-getMajorIncident', displayE);
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

    describe('#createMajorIncident - errors', () => {
      it('should have a createMajorIncident function', (done) => {
        try {
          assert.equal(true, typeof a.createMajorIncident === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing incidentId', (done) => {
        try {
          a.createMajorIncident(null, null, (data, error) => {
            try {
              const displayE = 'incidentId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-createMajorIncident', displayE);
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
      it('should error if - missing body', (done) => {
        try {
          a.createMajorIncident('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-createMajorIncident', displayE);
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

    describe('#createChangeRequestRiskAssessment - errors', () => {
      it('should have a createChangeRequestRiskAssessment function', (done) => {
        try {
          assert.equal(true, typeof a.createChangeRequestRiskAssessment === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing riskAssessment', (done) => {
        try {
          a.createChangeRequestRiskAssessment(null, (data, error) => {
            try {
              const displayE = 'riskAssessment is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-createChangeRequestRiskAssessment', displayE);
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

    describe('#autoApproveChangeRequest - errors', () => {
      it('should have a autoApproveChangeRequest function', (done) => {
        try {
          assert.equal(true, typeof a.autoApproveChangeRequest === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing changeId', (done) => {
        try {
          a.autoApproveChangeRequest(null, null, (data, error) => {
            try {
              const displayE = 'changeId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-autoApproveChangeRequest', displayE);
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
      it('should error if - missing approval', (done) => {
        try {
          a.autoApproveChangeRequest('fakeparam', null, (data, error) => {
            try {
              const displayE = 'approval is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-servicenow-adapter-autoApproveChangeRequest', displayE);
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
  });
});
