/* @copyright Itential, LLC 2018-9 */

// Set globals
/* global log */
/* eslint class-methods-use-this:warn */
/* eslint import/no-dynamic-require: warn */
/* eslint no-loop-func: warn */
/* eslint no-cond-assign: warn */
/* eslint global-require: warn */
/* eslint no-unused-vars: warn */
/* eslint prefer-destructuring: warn */

/* Required libraries.  */
const path = require('path');
const { execSync } = require('child_process');
const { spawnSync } = require('child_process');
const EventEmitterCl = require('events').EventEmitter;
const fs = require('fs-extra');
const jsonQuery = require('json-query');

const sampleProperties = require(`${__dirname}/sampleProperties.json`).properties;

/* The schema validator */
const AjvCl = require('ajv');
const { Test } = require('mocha');

/* Fetch in the other needed components for the this Adaptor */
const PropUtilCl = require('@itentialopensource/adapter-utils').PropertyUtility;
const RequestHandlerCl = require('@itentialopensource/adapter-utils').RequestHandler;

const entitiesToDB = require(path.join(__dirname, 'utils/entitiesToDB'));
const troubleshootingAdapter = require(path.join(__dirname, 'utils/troubleshootingAdapter'));
const tbUtils = require(path.join(__dirname, 'utils/tbUtils'));
const taskMover = require(path.join(__dirname, 'utils/taskMover'));

let propUtil = null;
let choosepath = null;

/*
 * INTERNAL FUNCTION: force fail the adapter - generally done to cause restart
 */
function forceFail(packChg) {
  if (packChg !== undefined && packChg !== null && packChg === true) {
    execSync(`rm -rf ${__dirname}/node modules`, { encoding: 'utf-8' });
    execSync(`rm -rf ${__dirname}/package-lock.json`, { encoding: 'utf-8' });
    execSync('npm install', { encoding: 'utf-8' });
  }
  log.error('NEED TO RESTART ADAPTER - FORCE FAIL');
  const errorObj = {
    origin: 'adapter-forceFail',
    type: 'Force Fail so adapter will restart',
    vars: []
  };
  setTimeout(() => {
    throw new Error(JSON.stringify(errorObj));
  }, 1000);
}

/*
 * INTERNAL FUNCTION: update the action.json
 */
function updateAction(entityPath, action, changes) {
  // if the action file does not exist - error
  const actionFile = path.join(entityPath, '/action.json');
  if (!fs.existsSync(actionFile)) {
    return 'Missing Action File';
  }

  // read in the file as a json object
  const ajson = require(path.resolve(entityPath, 'action.json'));
  let chgAct = {};

  // get the action we need to change
  for (let a = 0; a < ajson.actions.length; a += 1) {
    if (ajson.actions[a].name === action) {
      chgAct = ajson.actions[a];
      break;
    }
  }
  // merge the changes into the desired action
  chgAct = propUtil.mergeProperties(changes, chgAct);

  fs.writeFileSync(actionFile, JSON.stringify(ajson, null, 2));
  return null;
}

/*
 * INTERNAL FUNCTION: update the schema file
 */
function updateSchema(entityPath, configFile, changes) {
  // if the schema file does not exist - error
  const schemaFile = path.join(entityPath, `/${configFile}`);
  if (!fs.existsSync(schemaFile)) {
    return 'Missing Schema File';
  }

  // read in the file as a json object
  let schema = require(path.resolve(entityPath, configFile));

  // merge the changes into the schema file
  schema = propUtil.mergeProperties(changes, schema);

  fs.writeFileSync(schemaFile, JSON.stringify(schema, null, 2));
  return null;
}

/*
 * INTERNAL FUNCTION: update the mock data file
 */
function updateMock(mockPath, configFile, changes, replace) {
  // if the mock file does not exist - create it
  const mockFile = path.join(mockPath, `/${configFile}`);
  if (!fs.existsSync(mockFile)) {
    const newMock = {};
    fs.writeFileSync(mockFile, JSON.stringify(newMock, null, 2));
  }

  // read in the file as a json object
  let mock = require(path.resolve(mockPath, configFile));

  // merge the changes into the mock file
  if (replace === true) {
    mock = changes;
  } else {
    mock = propUtil.mergeProperties(changes, mock);
  }

  fs.writeFileSync(mockFile, JSON.stringify(mock, null, 2));
  return null;
}

/*
 * INTERNAL FUNCTION: update the package dependencies
 */
function updatePackage(changes) {
  // if the schema file does not exist - error
  const packFile = path.join(__dirname, '/package.json');
  if (!fs.existsSync(packFile)) {
    return 'Missing Pacakge File';
  }

  // read in the file as a json object
  const pack = require(path.resolve(__dirname, 'package.json'));

  // only certain changes are allowed
  if (changes.dependencies) {
    const keys = Object.keys(changes.dependencies);

    for (let k = 0; k < keys.length; k += 1) {
      pack.dependencies[keys[k]] = changes.dependencies[keys[k]];
    }
  }

  fs.writeFileSync(packFile, JSON.stringify(pack, null, 2));
  return null;
}

/* GENERAL ADAPTER FUNCTIONS THESE SHOULD NOT BE DIRECTLY MODIFIED */
/* IF YOU NEED MODIFICATIONS, REDEFINE THEM IN adapter.js!!! */
class AdapterBase extends EventEmitterCl {
  /**
   * [System] Adapter
   * @constructor
   */
  constructor(prongid, properties) {
    // Instantiate the EventEmitter super class
    super();

    // IAP home directory injected by core when running the adapter within IAP
    [, , , process.env.iap_home] = process.argv;

    try {
      // Capture the adapter id
      this.id = prongid;
      this.propUtilInst = new PropUtilCl(prongid, __dirname);
      propUtil = this.propUtilInst;
      this.initProps = properties;
      this.alive = false;
      this.healthy = false;
      this.suspended = false;
      this.suspendMode = 'pause';
      this.caching = false;
      this.repeatCacheCount = 0;
      this.allowFailover = 'AD.300';
      this.noFailover = 'AD.500';

      // set up the properties I care about
      this.refreshProperties(properties);

      // Instantiate the other components for this Adapter
      this.requestHandlerInst = new RequestHandlerCl(this.id, this.allProps, __dirname);
    } catch (e) {
      // handle any exception
      const origin = `${this.id}-adapterBase-constructor`;
      log.error(`${origin}: Adapter may not have started properly. ${e}`);
    }
  }

  /**
   * @callback healthCallback
   * @param {Object} result - the result of the get request (contains an id and a status)
   */
  /**
   * @callback getCallback
   * @param {Object} result - the result of the get request (entity/ies)
   * @param {String} error - any error that occured
   */
  /**
   * @callback createCallback
   * @param {Object} item - the newly created entity
   * @param {String} error - any error that occured
   */
  /**
   * @callback updateCallback
   * @param {String} status - the status of the update action
   * @param {String} error - any error that occured
   */
  /**
   * @callback deleteCallback
   * @param {String} status - the status of the delete action
   * @param {String} error - any error that occured
   */

  /**
   * refreshProperties is used to set up all of the properties for the connector.
   * It allows properties to be changed later by simply calling refreshProperties rather
   * than having to restart the connector.
   *
   * @function refreshProperties
   * @param {Object} properties - an object containing all of the properties
   * @param {boolean} init - are we initializing -- is so no need to refresh throtte engine
   */
  refreshProperties(properties) {
    const meth = 'adapterBase-refreshProperties';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      // Read the properties schema from the file system
      const propertiesSchema = JSON.parse(fs.readFileSync(path.join(__dirname, 'propertiesSchema.json'), 'utf-8'));

      // add any defaults to the data
      const defProps = this.propUtilInst.setDefaults(propertiesSchema);
      this.allProps = this.propUtilInst.mergeProperties(properties, defProps);

      // validate the entity against the schema
      const ajvInst = new AjvCl({ strictSchema: false, allowUnionTypes: true });
      const validate = ajvInst.compile(propertiesSchema);
      const result = validate(this.allProps);

      // if invalid properties throw an error
      if (!result) {
        if (this.requestHandlerInst) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Properties', [JSON.stringify(validate.errors)], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          throw new Error(JSON.stringify(errorObj));
        } else {
          log.error(`${origin}: ${JSON.stringify(validate.errors)}`);
          throw new Error(`${origin}: ${JSON.stringify(validate.errors)}`);
        }
      }

      // properties that this code cares about
      this.healthcheckType = this.allProps.healthcheck.type;
      this.healthcheckInterval = this.allProps.healthcheck.frequency;
      this.healthcheckQuery = this.allProps.healthcheck.query_object;

      // set the failover codes from properties
      if (this.allProps.request.failover_codes) {
        if (Array.isArray(this.allProps.request.failover_codes)) {
          this.failoverCodes = this.allProps.request.failover_codes;
        } else {
          this.failoverCodes = [this.allProps.request.failover_codes];
        }
      } else {
        this.failoverCodes = [];
      }

      // set the caching flag from properties
      if (this.allProps.cache_location) {
        if (this.allProps.cache_location === 'redis' || this.allProps.cache_location === 'local') {
          this.caching = true;
        }
      }

      // if this is truly a refresh and we have a request handler, refresh it
      if (this.requestHandlerInst) {
        this.requestHandlerInst.refreshProperties(properties);
      }
    } catch (e) {
      log.error(`${origin}: Properties may not have been set properly. ${e}`);
    }
  }

  /**
   * @summary Connect function is used during Pronghorn startup to provide instantiation feedback.
   *
   * @function connect
   */
  connect() {
    const origin = `${this.id}-adapterBase-connect`;
    log.trace(origin);

    // initially set as off
    this.emit('OFFLINE', { id: this.id });
    this.alive = true;

    // if there is no healthcheck just change the emit to ONLINE
    // We do not recommend no healthcheck!!!
    if (this.healthcheckType === 'none') {
      log.error(`${origin}: Waiting 1 Seconds to emit Online`);
      setTimeout(() => {
        this.emit('ONLINE', { id: this.id });
        this.healthy = true;
      }, 1000);
    }

    // is the healthcheck only suppose to run on startup
    // (intermittent runs on startup and after that)
    if (this.healthcheckType === 'startup' || this.healthcheckType === 'intermittent') {
      // run an initial healthcheck
      this.healthCheck(null, (status) => {
        log.spam(`${origin}: ${status}`);
      });
    }

    // is the healthcheck suppose to run intermittently
    if (this.healthcheckType === 'intermittent') {
      // run the healthcheck in an interval
      setInterval(() => {
        // try to see if mongo is available
        this.healthCheck(null, (status) => {
          log.spam(`${origin}: ${status}`);
        });
      }, this.healthcheckInterval);
    }
  }

  /**
   * @summary HealthCheck function is used to provide Pronghorn the status of this adapter.
   *
   * @function healthCheck
   */
  healthCheck(reqObj, callback) {
    const origin = `${this.id}-adapterBase-healthCheck`;
    log.trace(origin);

    // if there is healthcheck query_object property, it needs to be added to the adapter
    let myRequest = reqObj;
    if (this.healthcheckQuery && Object.keys(this.healthcheckQuery).length > 0) {
      if (myRequest && myRequest.uriQuery) {
        myRequest.uriQuery = { ...myRequest.uriQuery, ...this.healthcheckQuery };
      } else if (myRequest) {
        myRequest.uriQuery = this.healthcheckQuery;
      } else {
        myRequest = {
          uriQuery: this.healthcheckQuery
        };
      }
    }

    // call to the healthcheck in connector
    return this.requestHandlerInst.identifyHealthcheck(myRequest, (res, error) => {
      // unhealthy
      if (error) {
        // if we were healthy, toggle health
        if (this.healthy) {
          this.emit('OFFLINE', { id: this.id });
          this.emit('DEGRADED', { id: this.id });
          this.healthy = false;
          if (typeof error === 'object') {
            log.error(`${origin}: HEALTH CHECK - Error ${JSON.stringify(error)}`);
          } else {
            log.error(`${origin}: HEALTH CHECK - Error ${error}`);
          }
        } else if (typeof error === 'object') {
          // still log but set the level to trace
          log.trace(`${origin}: HEALTH CHECK - Still Errors ${JSON.stringify(error)}`);
        } else {
          log.trace(`${origin}: HEALTH CHECK - Still Errors ${error}`);
        }

        return callback(false);
      }

      // if we were unhealthy, toggle health
      if (!this.healthy) {
        this.emit('FIXED', { id: this.id });
        this.emit('ONLINE', { id: this.id });
        this.healthy = true;
        log.info(`${origin}: HEALTH CHECK SUCCESSFUL`);
      } else {
        // still log but set the level to trace
        log.trace(`${origin}: HEALTH CHECK STILL SUCCESSFUL`);
      }

      return callback(true);
    });
  }

  /**
   * getAllFunctions is used to get all of the exposed function in the adapter
   *
   * @function getAllFunctions
   */
  getAllFunctions() {
    let myfunctions = [];
    let obj = this;

    // find the functions in this class
    do {
      const l = Object.getOwnPropertyNames(obj)
        .concat(Object.getOwnPropertySymbols(obj).map((s) => s.toString()))
        .sort()
        .filter((p, i, arr) => typeof obj[p] === 'function' && p !== 'constructor' && (i === 0 || p !== arr[i - 1]) && myfunctions.indexOf(p) === -1);
      myfunctions = myfunctions.concat(l);
    }
    while (
      (obj = Object.getPrototypeOf(obj)) && Object.getPrototypeOf(obj)
    );

    return myfunctions;
  }

  /**
   * iapGetAdapterWorkflowFunctions is used to get all of the workflow function in the adapter
   * @param {array} ignoreThese - additional methods to ignore (optional)
   *
   * @function iapGetAdapterWorkflowFunctions
   */
  iapGetAdapterWorkflowFunctions(ignoreThese) {
    const myfunctions = this.getAllFunctions();
    const wffunctions = [];

    // remove the functions that should not be in a Workflow
    for (let m = 0; m < myfunctions.length; m += 1) {
      if (myfunctions[m] === 'checkActionFiles') {
        // got to the second tier (adapterBase)
        break;
      }
      if (!(myfunctions[m].endsWith('Emit') || myfunctions[m].match(/Emit__v[0-9]+/))) {
        let found = false;
        if (ignoreThese && Array.isArray(ignoreThese)) {
          for (let i = 0; i < ignoreThese.length; i += 1) {
            if (myfunctions[m].toUpperCase() === ignoreThese[i].toUpperCase()) {
              found = true;
            }
          }
        }
        if (!found) {
          wffunctions.push(myfunctions[m]);
        }
      }
    }

    return wffunctions;
  }

  /**
   * checkActionFiles is used to update the validation of the action files.
   *
   * @function checkActionFiles
   */
  checkActionFiles() {
    const origin = `${this.id}-adapterBase-checkActionFiles`;
    log.trace(origin);

    // validate the action files for the adapter
    try {
      return this.requestHandlerInst.checkActionFiles();
    } catch (e) {
      return ['Exception increase log level'];
    }
  }

  /**
   * checkProperties is used to validate the adapter properties.
   *
   * @function checkProperties
   * @param {Object} properties - an object containing all of the properties
   */
  checkProperties(properties) {
    const origin = `${this.myid}-adapterBase-checkProperties`;
    log.trace(origin);

    // validate the properties for the adapter
    try {
      return this.requestHandlerInst.checkProperties(properties);
    } catch (e) {
      return { exception: 'Exception increase log level' };
    }
  }

  /**
   * @summary Takes in property text and an encoding/encryption and returns the resulting
   * encoded/encrypted string
   *
   * @function encryptProperty
   * @param {String} property - the property to encrypt
   * @param {String} technique - the technique to use to encrypt
   *
   * @param {Callback} callback - a callback function to return the result
   *                              Encrypted String or the Error
   */
  encryptProperty(property, technique, callback) {
    const origin = `${this.id}-adapterBase-encryptProperty`;
    log.trace(origin);

    // Make the call -
    // encryptProperty(property, technique, callback)
    return this.requestHandlerInst.encryptProperty(property, technique, callback);
  }

  /**
   * iapUpdateAdapterConfiguration is used to update any of the adapter configuration files. This
   * allows customers to make changes to adapter configuration without having to be on the
   * file system.
   *
   * @function iapUpdateAdapterConfiguration
   * @param {string} configFile - the name of the file being updated (required)
   * @param {Object} changes - an object containing all of the changes = formatted like the configuration file (required)
   * @param {string} entity - the entity to be changed, if an action, schema or mock data file (optional)
   * @param {string} type - the type of entity file to change, (action, schema, mock) (optional)
   * @param {string} action - the action to be changed, if an action, schema or mock data file (optional)
   * @param {boolean} replace - true to replace entire mock data, false to merge/append (optional)
   * @param {Callback} callback - The results of the call
   */
  iapUpdateAdapterConfiguration(configFile, changes, entity, type, action, replace, callback) {
    const meth = 'adapterBase-iapUpdateAdapterConfiguration';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    // verify the parameters are valid
    if (changes === undefined || changes === null || typeof changes !== 'object'
      || Object.keys(changes).length === 0) {
      const result = {
        response: 'No configuration updates to make'
      };
      log.info(result.response);
      return callback(result, null);
    }
    if (configFile === undefined || configFile === null || configFile === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['configFile'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    // take action based on configFile being changed
    if (configFile === 'package.json') {
      const pres = updatePackage(changes);
      if (pres) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, `Incomplete Configuration Change: ${pres}`, [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
      const result = {
        response: 'Package updates completed - restarting adapter'
      };
      log.info(result.response);
      forceFail(true);
      return callback(result, null);
    }
    if (entity === undefined || entity === null || entity === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Unsupported Configuration Change or Missing Entity', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    // this means we are changing an entity file so type is required
    if (type === undefined || type === null || type === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['type'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    // if the entity does not exist - error
    const epath = `${__dirname}/entities/${entity}`;
    if (!fs.existsSync(epath)) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, `Incomplete Configuration Change: Invalid Entity - ${entity}`, [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    // take action based on type of file being changed
    if (type === 'action') {
      // BACKUP???
      const ares = updateAction(epath, action, changes);
      if (ares) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, `Incomplete Configuration Change: ${ares}`, [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
      // AJV CHECK???
      // RESTORE IF NEEDED???
      const result = {
        response: `Action updates completed to entity: ${entity} - ${action}`
      };
      log.info(result.response);
      return callback(result, null);
    }
    if (type === 'schema') {
      const sres = updateSchema(epath, configFile, changes);
      if (sres) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, `Incomplete Configuration Change: ${sres}`, [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
      const result = {
        response: `Schema updates completed to entity: ${entity} - ${configFile}`
      };
      log.info(result.response);
      return callback(result, null);
    }
    if (type === 'mock') {
      // if the mock directory does not exist - error
      const mpath = `${__dirname}/entities/${entity}/mockdatafiles`;
      if (!fs.existsSync(mpath)) {
        fs.mkdirSync(mpath);
      }
      // this means we are changing a mock data file so replace is required
      if (replace === undefined || replace === null || replace === '') {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['replace'], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
      const mres = updateMock(mpath, configFile, changes, replace);

      if (mres) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, `Incomplete Configuration Change: ${mres}`, [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
      const result = {
        response: `Mock data updates completed to entity: ${entity} - ${configFile}`
      };
      log.info(result.response);
      return callback(result, null);
    }
    const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, `Incomplete Configuration Change: Unsupported Type - ${type}`, [], null, null, null);
    log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
    return callback(null, errorObj);
  }

  /**
   * @summary Suspends the adapter
   * @param {Callback} callback - The adapater suspension status
   * @function iapSuspendAdapter
   */
  iapSuspendAdapter(mode, callback) {
    const origin = `${this.id}-adapterBase-iapSuspendAdapter`;
    if (this.suspended) {
      throw new Error(`${origin}: Adapter is already suspended`);
    }
    try {
      this.suspended = true;
      this.suspendMode = mode;
      if (this.suspendMode === 'pause') {
        const props = JSON.parse(JSON.stringify(this.initProps));
        // To suspend adapter, enable throttling and set concurrent max to 0
        props.throttle.throttle_enabled = true;
        props.throttle.concurrent_max = 0;
        this.refreshProperties(props);
      }
      return callback({ suspended: true });
    } catch (error) {
      return callback(null, error);
    }
  }

  /**
   * @summary Unsuspends the adapter
   * @param {Callback} callback - The adapater suspension status
   *
   * @function iapUnsuspendAdapter
   */
  iapUnsuspendAdapter(callback) {
    const origin = `${this.id}-adapterBase-iapUnsuspendAdapter`;
    if (!this.suspended) {
      throw new Error(`${origin}: Adapter is not suspended`);
    }
    if (this.suspendMode === 'pause') {
      const props = JSON.parse(JSON.stringify(this.initProps));
      // To unsuspend adapter, keep throttling enabled and begin processing queued requests in order
      props.throttle.throttle_enabled = true;
      props.throttle.concurrent_max = 1;
      this.refreshProperties(props);
      setTimeout(() => {
        this.getQueue((q, error) => {
          // console.log("Items in queue: " + String(q.length))
          if (q.length === 0) {
            // if queue is empty, return to initial properties state
            this.refreshProperties(this.initProps);
            this.suspended = false;
            return callback({ suspended: false });
          }
          // recursive call to check queue again every second
          return this.iapUnsuspendAdapter(callback);
        });
      }, 1000);
    } else {
      this.suspended = false;
      callback({ suspend: false });
    }
  }

  /**
   * iapGetAdapterQueue is used to get information for all of the requests currently in the queue.
   *
   * @function iapGetAdapterQueue
   * @param {Callback} callback - a callback function to return the result (Queue) or the error
   */
  iapGetAdapterQueue(callback) {
    const origin = `${this.id}-adapterBase-iapGetAdapterQueue`;
    log.trace(origin);

    return this.requestHandlerInst.getQueue(callback);
  }

  /* ********************************************** */
  /*                                                */
  /*          EXPOSES ADAPTER SCRIPTS               */
  /*                                                */
  /* ********************************************** */
  /**
   * See if the API path provided is found in this adapter
   *
   * @function iapFindAdapterPath
   * @param {string} apiPath - the api path to check on
   * @param {Callback} callback - The results of the call
   */
  iapFindAdapterPath(apiPath, callback) {
    const result = {
      apiPath
    };

    // verify the path was provided
    if (!apiPath) {
      log.error('NO API PATH PROVIDED!');
      result.found = false;
      result.message = 'NO PATH PROVIDED!';
      return callback(null, result);
    }

    if (typeof this.allProps.choosepath === 'string') {
      choosepath = this.allProps.choosepath;
    }

    // make sure the entities directory exists
    const entitydir = path.join(__dirname, 'entities');
    if (!fs.statSync(entitydir).isDirectory()) {
      log.error('Could not find the entities directory');
      result.found = false;
      result.message = 'Could not find the entities directory';
      return callback(null, result);
    }

    const entities = fs.readdirSync(entitydir);
    const fitems = [];

    // need to go through each entity in the entities directory
    for (let e = 0; e < entities.length; e += 1) {
      // make sure the entity is a directory - do not care about extra files
      // only entities (dir)
      if (fs.statSync(`${entitydir}/${entities[e]}`).isDirectory()) {
        // see if the action file exists in the entity
        if (fs.existsSync(`${entitydir}/${entities[e]}/action.json`)) {
          // Read the entity actions from the file system
          const actions = require(`${entitydir}/${entities[e]}/action.json`);

          // go through all of the actions set the appropriate info in the newActions
          for (let a = 0; a < actions.actions.length; a += 1) {
            if (actions.actions[a].entitypath && typeof actions.actions[a].entitypath === 'object') {
              const entityKeys = Object.keys(actions.actions[a].entitypath);
              if (entityKeys.length > 0) {
                for (let entityKey = 0; entityKey < entityKeys.length; entityKey += 1) {
                  if (choosepath && entityKeys[entityKey] === choosepath && actions.actions[a].entitypath[entityKeys[entityKey]].indexOf(apiPath) >= 0) {
                    log.info(`  Found - entity: ${entities[e]} action: ${actions.actions[a].name}`);
                    log.info(`          method: ${actions.actions[a].method} path: ${actions.actions[a].entitypath[entityKeys[entityKey]]}`);
                    const fitem = {
                      entity: entities[e],
                      action: actions.actions[a].name,
                      method: actions.actions[a].method,
                      path: actions.actions[a].entitypath[entityKeys[entityKey]]
                    };
                    fitems.push(fitem);
                    break;
                  }
                }
              }
            } else if (actions.actions[a].entitypath.indexOf(apiPath) >= 0) {
              log.info(`  Found - entity: ${entities[e]} action: ${actions.actions[a].name}`);
              log.info(`          method: ${actions.actions[a].method} path: ${actions.actions[a].entitypath}`);
              const fitem = {
                entity: entities[e],
                action: actions.actions[a].name,
                method: actions.actions[a].method,
                path: actions.actions[a].entitypath
              };
              fitems.push(fitem);
            }
          }
        } else {
          log.error(`Could not find entities ${entities[e]} action.json file`);
          result.found = false;
          result.message = `Could not find entities ${entities[e]} action.json file`;
          return callback(null, result);
        }
      } else {
        log.error(`Could not find entities ${entities[e]} directory`);
        result.found = false;
        result.message = `Could not find entities ${entities[e]} directory`;
        return callback(null, result);
      }
    }

    if (fitems.length === 0) {
      log.info('PATH NOT FOUND!');
      result.found = false;
      result.message = 'API PATH NOT FOUND!';
      return callback(null, result);
    }

    result.foundIn = fitems;
    result.found = true;
    result.message = 'API PATH FOUND!';
    return callback(result, null);
  }

  /**
   * @summary runs troubleshoot scripts for adapter
   *
   * @function iapTroubleshootAdapter
   * @param {Object} props - the connection, healthcheck and authentication properties
   * @param {boolean} persistFlag - whether the adapter properties should be updated
   * @param {Adapter} adapter - adapter instance to troubleshoot
   * @param {Callback} callback - callback function to return troubleshoot results
   */
  async iapTroubleshootAdapter(props, persistFlag, adapter, callback) {
    try {
      const result = await troubleshootingAdapter.troubleshoot(props, false, persistFlag, adapter);
      if (result.healthCheck && result.connectivity.failCount === 0 && result.basicGet.failCount === 0) {
        return callback(result);
      }
      return callback(null, result);
    } catch (error) {
      return callback(null, error);
    }
  }

  /**
   * @summary runs healthcheck script for adapter
   *
   * @function iapRunAdapterHealthcheck
   * @param {Adapter} adapter - adapter instance to troubleshoot
   * @param {Callback} callback - callback function to return healthcheck status
   */
  async iapRunAdapterHealthcheck(adapter, callback) {
    try {
      const result = await tbUtils.healthCheck(adapter);
      if (result) {
        return callback(result);
      }
      return callback(null, 'Healthcheck failed');
    } catch (error) {
      return callback(null, error);
    }
  }

  /**
   * @summary runs connectivity check script for adapter
   *
   * @function iapRunAdapterConnectivity
   * @param {Adapter} adapter - adapter instance to troubleshoot
   * @param {Callback} callback - callback function to return connectivity status
   */
  async iapRunAdapterConnectivity(callback) {
    try {
      const { host } = this.allProps;
      const result = tbUtils.runConnectivity(host, false);
      if (result.failCount > 0) {
        return callback(null, result);
      }
      return callback(result);
    } catch (error) {
      return callback(null, error);
    }
  }

  /**
   * @summary runs basicGet script for adapter
   *
   * @function iapRunAdapterBasicGet
   * @param {Callback} callback - callback function to return basicGet result
   */
  iapRunAdapterBasicGet(callback) {
    try {
      const result = tbUtils.runBasicGet(false);
      if (result.failCount > 0) {
        return callback(null, result);
      }
      return callback(result);
    } catch (error) {
      return callback(null, error);
    }
  }

  /**
   * @summary moves entities to mongo database
   *
   * @function iapMoveAdapterEntitiesToDB
   *
   * @return {Callback} - containing the response from the mongo transaction
   */
  async iapMoveAdapterEntitiesToDB(callback) {
    const meth = 'adapterBase-iapMoveAdapterEntitiesToDB';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      const result = await entitiesToDB.moveEntitiesToDB(__dirname, { pronghornProps: this.allProps, id: this.id });
      return callback(result, null);
    } catch (err) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, err);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, err.message);
    }
  }

  /**
   * @function iapDeactivateTasks
   *
   * @param {Array} tasks - List of tasks to deactivate
   * @param {Callback} callback
   */
  iapDeactivateTasks(tasks, callback) {
    const meth = 'adapterBase-iapDeactivateTasks';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);
    let data;
    try {
      data = taskMover.deactivateTasks(__dirname, tasks);
    } catch (ex) {
      taskMover.rollbackChanges(__dirname);
      taskMover.deleteBackups(__dirname);
      return callback(null, ex);
    }
    taskMover.deleteBackups(__dirname);
    return callback(data, null);
  }

  /**
   * @function iapActivateTasks
   *
   * @param {Array} tasks - List of tasks to deactivate
   * @param {Callback} callback
   */
  iapActivateTasks(tasks, callback) {
    const meth = 'adapterBase-iapActivateTasks';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);
    let data;
    try {
      data = taskMover.activateTasks(__dirname, tasks);
    } catch (ex) {
      taskMover.rollbackChanges(__dirname);
      taskMover.deleteBackups(__dirname);
      return callback(null, ex);
    }
    taskMover.deleteBackups(__dirname);
    return callback(data, null);
  }

  /* ********************************************** */
  /*                                                */
  /*            EXPOSES CACHE CALLS                 */
  /*                                                */
  /* ********************************************** */
  /**
   * @summary Populate the cache for the given entities
   *
   * @function iapPopulateEntityCache
   * @param {String/Array of Strings} entityType - the entity type(s) to populate
   * @param {Callback} callback - whether the cache was updated or not for each entity type
   * @returns return of the callback
   */
  iapPopulateEntityCache(entityTypes, callback) {
    const origin = `${this.myid}-adapterBase-iapPopulateEntityCache`;
    log.trace(origin);

    return this.requestHandlerInst.populateEntityCache(entityTypes, callback);
  }

  /**
   * @summary Retrieves data from cache for specified entity type
   *
   * @function iapRetrieveEntitiesCache
   * @param {String} entityType - entity of which to retrieve
   * @param {Object} options - settings of which data to return and how to return it
   * @param {Callback} callback - the data if it was retrieved
   */
  iapRetrieveEntitiesCache(entityType, options, callback) {
    const origin = `${this.myid}-adapterBase-iapRetrieveEntitiesCache`;
    log.trace(origin);

    return this.requestHandlerInst.retrieveEntitiesCache(entityType, options, callback);
  }

  /* ********************************************** */
  /*                                                */
  /*           EXPOSES BROKER CALLS                 */
  /*                                                */
  /* ********************************************** */
  /**
   * @summary Determines if this adapter supports any in a list of entities
   *
   * @function hasEntities
   * @param {String} entityType - the entity type to check for
   * @param {Array} entityList - the list of entities we are looking for
   *
   * @param {Callback} callback - A map where the entity is the key and the
   *                              value is true or false
   */
  hasEntities(entityType, entityList, callback) {
    const origin = `${this.id}-adapterBase-hasEntities`;
    log.trace(origin);

    return this.requestHandlerInst.hasEntities(entityType, entityList, callback);
  }

  /**
   * @summary Determines if this adapter supports any in a list of entities
   *
   * @function hasEntitiesAuth
   * @param {String} entityType - the entity type to check for
   * @param {Array} entityList - the list of entities we are looking for
   * @param {Object} callOptions - Additional options used to make request, including auth headers, AWS service, or datatypes
   *
   * @param {Callback} callback - A map where the entity is the key and the
   *                              value is true or false
   */
  hasEntitiesAuth(entityType, entityList, callOptions, callback) {
    const origin = `${this.id}-adapterBase-hasEntitiesAuth`;
    log.trace(origin);

    return this.requestHandlerInst.hasEntitiesAuth(entityType, entityList, callOptions, callback);
  }

  /**
   * @summary Get Appliance that match the deviceName
   *
   * @function getDevice
   * @param {String} deviceName - the deviceName to find (required)
   *
   * @param {getCallback} callback - a callback function to return the result
   *                                 (appliance) or the error
   */
  getDevice(deviceName, callback) {
    const origin = `${this.id}-adapterBase-getDevice`;
    log.trace(origin);

    return this.requestHandlerInst.getDevice(deviceName, callback);
  }

  /**
   * @summary Get Appliance that match the deviceName
   *
   * @function getDeviceAuth
   * @param {String} deviceName - the deviceName to find (required)
   * @param {Object} callOptions - Additional options used to make request, including auth headers, AWS service, or datatypes
   *
   * @param {getCallback} callback - a callback function to return the result
   *                                 (appliance) or the error
   */
  getDeviceAuth(deviceName, callOptions, callback) {
    const origin = `${this.id}-adapterBase-getDeviceAuth`;
    log.trace(origin);

    return this.requestHandlerInst.getDeviceAuth(deviceName, callOptions, callback);
  }

  /**
   * @summary Get Appliances that match the filter
   *
   * @function getDevicesFiltered
   * @param {Object} options - the data to use to filter the appliances (optional)
   *
   * @param {getCallback} callback - a callback function to return the result
   *                                 (appliances) or the error
   */
  getDevicesFiltered(options, callback) {
    const origin = `${this.id}-adapterBase-getDevicesFiltered`;
    log.trace(origin);

    return this.requestHandlerInst.getDevicesFiltered(options, callback);
  }

  /**
   * @summary Get Appliances that match the filter
   *
   * @function getDevicesFilteredAuth
   * @param {Object} options - the data to use to filter the appliances (optional)
   * @param {Object} callOptions - Additional options used to make request, including auth headers, AWS service, or datatypes
   *
   * @param {getCallback} callback - a callback function to return the result
   *                                 (appliances) or the error
   */
  getDevicesFilteredAuth(options, callOptions, callback) {
    const origin = `${this.id}-adapterBase-getDevicesFilteredAuth`;
    log.trace(origin);

    return this.requestHandlerInst.getDevicesFilteredAuth(options, callOptions, callback);
  }

  /**
   * @summary Gets the status for the provided appliance
   *
   * @function isAlive
   * @param {String} deviceName - the deviceName of the appliance. (required)
   *
   * @param {configCallback} callback - callback function to return the result
   *                                    (appliance isAlive) or the error
   */
  isAlive(deviceName, callback) {
    const origin = `${this.id}-adapterBase-isAlive`;
    log.trace(origin);

    return this.requestHandlerInst.isAlive(deviceName, callback);
  }

  /**
   * @summary Gets the status for the provided appliance
   *
   * @function isAliveAuth
   * @param {String} deviceName - the deviceName of the appliance. (required)
   * @param {Object} callOptions - Additional options used to make request, including auth headers, AWS service, or datatypes
   *
   * @param {configCallback} callback - callback function to return the result
   *                                    (appliance isAliveAuth) or the error
   */
  isAliveAuth(deviceName, callOptions, callback) {
    const origin = `${this.id}-adapterBase-isAliveAuth`;
    log.trace(origin);

    return this.requestHandlerInst.isAliveAuth(deviceName, callOptions, callback);
  }

  /**
   * @summary Gets a config for the provided Appliance
   *
   * @function getConfig
   * @param {String} deviceName - the deviceName of the appliance. (required)
   * @param {String} format - the desired format of the config. (optional)
   *
   * @param {configCallback} callback - callback function to return the result
   *                                    (appliance config) or the error
   */
  getConfig(deviceName, format, callback) {
    const origin = `${this.id}-adapterBase-getConfig`;
    log.trace(origin);

    return this.requestHandlerInst.getConfig(deviceName, format, callback);
  }

  /**
   * @summary Gets a config for the provided Appliance
   *
   * @function getConfigAuth
   * @param {String} deviceName - the deviceName of the appliance. (required)
   * @param {String} format - the desired format of the config. (optional)
   * @param {Object} callOptions - Additional options used to make request, including auth headers, AWS service, or datatypes
   *
   * @param {configCallback} callback - callback function to return the result
   *                                    (appliance config) or the error
   */
  getConfigAuth(deviceName, format, callOptions, callback) {
    const origin = `${this.id}-adapterBase-getConfigAuth`;
    log.trace(origin);

    return this.requestHandlerInst.getConfigAuth(deviceName, format, callOptions, callback);
  }

  /**
   * @summary Gets the device count from the system
   *
   * @function iapGetDeviceCount
   *
   * @param {getCallback} callback - callback function to return the result
   *                                    (count) or the error
   */
  iapGetDeviceCount(callback) {
    const origin = `${this.id}-adapterBase-iapGetDeviceCount`;
    log.trace(origin);

    return this.requestHandlerInst.iapGetDeviceCount(callback);
  }

  /**
   * @summary Gets the device count from the system
   *
   * @function iapGetDeviceCountAuth
   * @param {Object} callOptions - Additional options used to make request, including auth headers, AWS service, or datatypes
   *
   * @param {getCallback} callback - callback function to return the result
   *                                    (count) or the error
   */
  iapGetDeviceCountAuth(callOptions, callback) {
    const origin = `${this.id}-adapterBase-iapGetDeviceCountAuth`;
    log.trace(origin);

    return this.requestHandlerInst.iapGetDeviceCountAuth(callOptions, callback);
  }

  /* ********************************************** */
  /*                                                */
  /*          EXPOSES GENERIC HANDLER               */
  /*                                                */
  /* ********************************************** */
  /**
   * Makes the requested generic call
   *
   * @function iapExpandedGenericAdapterRequest
   * @param {Object} metadata - metadata for the call (optional).
   *                 Can be a stringified Object.
   * @param {String} uriPath - the path of the api call - do not include the host, port, base path or version (optional)
   * @param {String} restMethod - the rest method (GET, POST, PUT, PATCH, DELETE) (optional)
   * @param {Object} pathVars - the parameters to be put within the url path (optional).
   *                 Can be a stringified Object.
   * @param {Object} queryData - the parameters to be put on the url (optional).
   *                 Can be a stringified Object.
   * @param {Object} requestBody - the body to add to the request (optional).
   *                 Can be a stringified Object.
   * @param {Object} addlHeaders - additional headers to be put on the call (optional).
   *                 Can be a stringified Object.
   * @param {getCallback} callback - a callback function to return the result (Generics)
   *                 or the error
   */
  iapExpandedGenericAdapterRequest(metadata, uriPath, restMethod, pathVars, queryData, requestBody, addlHeaders, callback) {
    const origin = `${this.myid}-adapterBase-iapExpandedGenericAdapterRequest`;
    log.trace(origin);

    return this.requestHandlerInst.expandedGenericAdapterRequest(metadata, uriPath, restMethod, pathVars, queryData, requestBody, addlHeaders, callback);
  }

  /**
   * Makes the requested generic call
   *
   * @function genericAdapterRequest
   * @param {String} uriPath - the path of the api call - do not include the host, port, base path or version (required)
   * @param {String} restMethod - the rest method (GET, POST, PUT, PATCH, DELETE) (required)
   * @param {Object} queryData - the parameters to be put on the url (optional).
   *                 Can be a stringified Object.
   * @param {Object} requestBody - the body to add to the request (optional).
   *                 Can be a stringified Object.
   * @param {Object} addlHeaders - additional headers to be put on the call (optional).
   *                 Can be a stringified Object.
   * @param {getCallback} callback - a callback function to return the result (Generics)
   *                 or the error
   */
  genericAdapterRequest(uriPath, restMethod, queryData, requestBody, addlHeaders, callback) {
    const origin = `${this.myid}-adapterBase-genericAdapterRequest`;
    log.trace(origin);

    return this.requestHandlerInst.genericAdapterRequest(uriPath, restMethod, queryData, requestBody, addlHeaders, callback);
  }

  /**
   * Makes the requested generic call with no base path or version
   *
   * @function genericAdapterRequestNoBasePath
   * @param {String} uriPath - the path of the api call - do not include the host, port, base path or version (required)
   * @param {String} restMethod - the rest method (GET, POST, PUT, PATCH, DELETE) (required)
   * @param {Object} queryData - the parameters to be put on the url (optional).
   *                 Can be a stringified Object.
   * @param {Object} requestBody - the body to add to the request (optional).
   *                 Can be a stringified Object.
   * @param {Object} addlHeaders - additional headers to be put on the call (optional).
   *                 Can be a stringified Object.
   * @param {getCallback} callback - a callback function to return the result (Generics)
   *                 or the error
   */
  genericAdapterRequestNoBasePath(uriPath, restMethod, queryData, requestBody, addlHeaders, callback) {
    const origin = `${this.myid}-adapterBase-genericAdapterRequestNoBasePath`;
    log.trace(origin);

    return this.requestHandlerInst.genericAdapterRequestNoBasePath(uriPath, restMethod, queryData, requestBody, addlHeaders, callback);
  }

  /* ********************************************** */
  /*                                                */
  /*          EXPOSES INVENTORY CALLS               */
  /*                                                */
  /* ********************************************** */
  /**
   * @summary run the adapter lint script to return the results.
   *
   * @function iapRunAdapterLint
   *
   * @return {Object} - containing the results of the lint call.
   */
  iapRunAdapterLint(callback) {
    const meth = 'adapterBase-iapRunAdapterLint';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);
    let command = null;

    if (fs.existsSync('package.json')) {
      const packageData = require('./package.json');

      // check if 'test', 'test:unit', 'test:integration' exists in package.json file
      if (!packageData.scripts || !packageData.scripts['lint:errors']) {
        log.error('The required script does not exist in the package.json file');
        return callback(null, 'The required script does not exist in the package.json file');
      }

      // execute 'npm run lint:errors' command
      command = spawnSync('npm', ['run', 'lint:errors'], { cwd: __dirname, encoding: 'utf-8' });

      // analyze and format the response
      const result = {
        status: 'SUCCESS'
      };
      if (command.status !== 0) {
        result.status = 'FAILED';
        result.output = command.stdout;
      }
      return callback(result);
    }

    log.error('Package Not Found');
    return callback(null, 'Package Not Found');
  }

  /**
   * @summary run the adapter test scripts (baseunit and unit) to return the results.
   *    can not run integration as there can be implications with that.
   *
   * @function iapRunAdapterTests
   *
   * @return {Object} - containing the results of the baseunit and unit tests.
   */
  iapRunAdapterTests(callback) {
    const meth = 'adapterBase-iapRunAdapterTests';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);
    let basecommand = null;
    let command = null;

    if (fs.existsSync('package.json')) {
      const packageData = require('./package.json');

      // check if 'test', 'test:unit', 'test:integration' exists in package.json file
      if (!packageData.scripts || !packageData.scripts['test:baseunit'] || !packageData.scripts['test:unit']) {
        log.error('The required scripts do not exist in the package.json file');
        return callback(null, 'The required scripts do not exist in the package.json file');
      }

      // run baseunit test
      basecommand = spawnSync('npm', ['run', 'test:baseunit'], { cwd: __dirname, encoding: 'utf-8' });

      // analyze and format the response to baseunit
      const baseresult = {
        status: 'SUCCESS'
      };
      if (basecommand.status !== 0) {
        baseresult.status = 'FAILED';
        baseresult.output = basecommand.stdout;
      }

      // run unit test
      command = spawnSync('npm', ['run', 'test:unit'], { cwd: __dirname, encoding: 'utf-8' });

      // analyze and format the response to unit
      const unitresult = {
        status: 'SUCCESS'
      };
      if (command.status !== 0) {
        unitresult.status = 'FAILED';
        unitresult.output = command.stdout;
      }

      // format the response and return it
      const result = {
        base: baseresult,
        unit: unitresult
      };
      return callback(result);
    }

    log.error('Package Not Found');
    return callback(null, 'Package Not Found');
  }

  /**
   * @summary provide inventory information abbout the adapter
   *
   * @function iapGetAdapterInventory
   *
   * @return {Object} - containing the adapter inventory information
   */
  iapGetAdapterInventory(callback) {
    const meth = 'adapterBase-iapGetAdapterInventory';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      // call to the adapter utils to get inventory
      return this.requestHandlerInst.getAdapterInventory((res, error) => {
        const adapterInv = res;

        // get all of the tasks
        const allTasks = this.getAllFunctions();
        adapterInv.totalTasks = allTasks.length;

        // get all of the possible workflow tasks
        const myIgnore = [
          'healthCheck',
          'iapGetAdapterWorkflowFunctions',
          'hasEntities'
        ];
        adapterInv.totalWorkflowTasks = this.iapGetAdapterWorkflowFunctions(myIgnore).length;

        // TODO: CACHE
        // CONFIRM CACHE
        // GET CACHE ENTITIES

        // get the Device Count
        return this.iapGetDeviceCount((devres, deverror) => {
          // if call failed assume not broker integrated
          if (deverror) {
            adapterInv.brokerDefined = false;
            adapterInv.deviceCount = -1;
          } else {
            // broker confirmed
            adapterInv.brokerDefined = true;
            adapterInv.deviceCount = 0;
            if (devres && devres.count) {
              adapterInv.deviceCount = devres.count;
            }
          }

          return callback(adapterInv);
        });
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }
}

module.exports = AdapterBase;
