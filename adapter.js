/* @copyright Itential, LLC 2019 (pre-modifications) */

/* eslint import/no-dynamic-require: warn */
/* eslint object-curly-newline: warn */
/* eslint no-underscore-dangle: warn  */
/* eslint camelcase: warn  */

// Set globals
/* global log */

/* Required libraries.  */
const path = require('path');

/* Fetch in the other needed components for the this Adaptor */
const AdapterBaseCl = require(path.join(__dirname, 'adapterBase.js'));

/**
 * This is the adapter/interface into Servicenow
 */

/* GENERAL ADAPTER FUNCTIONS */
class Servicenow extends AdapterBaseCl {
  /**
   * Servicenow Adapter
   * @constructor
   */
  /* Working on changing the way we do Emit methods due to size and time constrainsts
  constructor(prongid, properties) {
    // Instantiate the AdapterBase super class
    super(prongid, properties);

    const restFunctionNames = this.getWorkflowFunctions();

    // Dynamically bind emit functions
    for (let i = 0; i < restFunctionNames.length; i += 1) {
      // Bind function to have name fnNameEmit for fnName
      const version = restFunctionNames[i].match(/__v[0-9]+/);
      const baseFnName = restFunctionNames[i].replace(/__v[0-9]+/, '');
      const fnNameEmit = version ? `${baseFnName}Emit${version}` : `${baseFnName}Emit`;
      this[fnNameEmit] = function (...args) {
        // extract the callback
        const callback = args[args.length - 1];
        // slice the callback from args so we can insert our own
        const functionArgs = args.slice(0, args.length - 1);
        // create a random name for the listener
        const eventName = `${restFunctionNames[i]}:${Math.random().toString(36)}`;
        // tell the calling class to start listening
        callback({ event: eventName, status: 'received' });
        // store parent for use of this context later
        const parent = this;
        // store emission function
        const func = function (val, err) {
          parent.removeListener(eventName, func);
          parent.emit(eventName, val, err);
        };
        // Use apply to call the function in a specific context
        this[restFunctionNames[i]].apply(this, functionArgs.concat([func])); // eslint-disable-line prefer-spread
      };
    }

    // Uncomment if you have things to add to the constructor like using your own properties.
    // Otherwise the constructor in the adapterBase will be used.
    // Capture my own properties - they need to be defined in propertiesSchema.json
    // if (this.allProps && this.allProps.myownproperty) {
    //   mypropvariable = this.allProps.myownproperty;
    // }
  }
  */

  /**
   * @callback healthCallback
   * @param {Object} reqObj - the request to send into the healthcheck
   * @param {Callback} callback - The results of the call
   */
  healthCheck(reqObj, callback) {
    // you can modify what is passed into the healthcheck by changing things in the newReq
    let newReq = null;
    if (reqObj) {
      newReq = Object.assign(...reqObj);
    }
    super.healthCheck(newReq, callback);
  }

  /**
   * @iapGetAdapterWorkflowFunctions
   */
  iapGetAdapterWorkflowFunctions(inIgnore) {
    let myIgnore = [
      'healthCheck',
      'iapGetAdapterWorkflowFunctions',
      'hasEntities',
      'getAuthorization'
    ];
    if (!inIgnore && Array.isArray(inIgnore)) {
      myIgnore = inIgnore;
    } else if (!inIgnore && typeof inIgnore === 'string') {
      myIgnore = [inIgnore];
    }

    // The generic adapter functions should already be ignored (e.g. healthCheck)
    // you can add specific methods that you do not want to be workflow functions to ignore like below
    // myIgnore.push('myMethodNotInWorkflow');

    return super.iapGetAdapterWorkflowFunctions(myIgnore);
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
   * @param {boolean} replace - true to replace entire mock data, false to merge/append
   * @param {Callback} callback - The results of the call
   */
  iapUpdateAdapterConfiguration(configFile, changes, entity, type, action, replace, callback) {
    const meth = 'adapter-iapUpdateAdapterConfiguration';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    super.iapUpdateAdapterConfiguration(configFile, changes, entity, type, action, replace, callback);
  }

  /**
    * @summary Suspends adapter
    *
    * @function iapSuspendAdapter
    * @param {Callback} callback - callback function
    */
  iapSuspendAdapter(mode, callback) {
    const meth = 'adapter-iapSuspendAdapter';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapSuspendAdapter(mode, callback);
    } catch (error) {
      log.error(`${origin}: ${error}`);
      return callback(null, error);
    }
  }

  /**
    * @summary Unsuspends adapter
    *
    * @function iapUnsuspendAdapter
    * @param {Callback} callback - callback function
    */
  iapUnsuspendAdapter(callback) {
    const meth = 'adapter-iapUnsuspendAdapter';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapUnsuspendAdapter(callback);
    } catch (error) {
      log.error(`${origin}: ${error}`);
      return callback(null, error);
    }
  }

  /**
    * @summary Get the Adapter Queue
    *
    * @function iapGetAdapterQueue
    * @param {Callback} callback - callback function
    */
  iapGetAdapterQueue(callback) {
    const meth = 'adapter-iapGetAdapterQueue';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    return super.iapGetAdapterQueue(callback);
  }

  /* SCRIPT CALLS */
  /**
   * See if the API path provided is found in this adapter
   *
   * @function iapFindAdapterPath
   * @param {string} apiPath - the api path to check on
   * @param {Callback} callback - The results of the call
   */
  iapFindAdapterPath(apiPath, callback) {
    const meth = 'adapter-iapFindAdapterPath';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    super.iapFindAdapterPath(apiPath, callback);
  }

  /**
  * @summary Runs troubleshoot scripts for adapter
  *
  * @function iapTroubleshootAdapter
  * @param {Object} props - the connection, healthcheck and authentication properties
  *
  * @param {boolean} persistFlag - whether the adapter properties should be updated
  * @param {Callback} callback - The results of the call
  */
  iapTroubleshootAdapter(props, persistFlag, callback) {
    const meth = 'adapter-iapTroubleshootAdapter';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapTroubleshootAdapter(props, persistFlag, this, callback);
    } catch (error) {
      log.error(`${origin}: ${error}`);
      return callback(null, error);
    }
  }

  /**
    * @summary runs healthcheck script for adapter
    *
    * @function iapRunAdapterHealthcheck
    * @param {Adapter} adapter - adapter instance to troubleshoot
    * @param {Callback} callback - callback function
    */
  iapRunAdapterHealthcheck(callback) {
    const meth = 'adapter-iapRunAdapterHealthcheck';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapRunAdapterHealthcheck(this, callback);
    } catch (error) {
      log.error(`${origin}: ${error}`);
      return callback(null, error);
    }
  }

  /**
    * @summary runs connectivity check script for adapter
    *
    * @function iapRunAdapterConnectivity
    * @param {Callback} callback - callback function
    */
  iapRunAdapterConnectivity(callback) {
    const meth = 'adapter-iapRunAdapterConnectivity';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapRunAdapterConnectivity(callback);
    } catch (error) {
      log.error(`${origin}: ${error}`);
      return callback(null, error);
    }
  }

  /**
    * @summary runs basicGet script for adapter
    *
    * @function iapRunAdapterBasicGet
    * @param {Callback} callback - callback function
    */
  iapRunAdapterBasicGet(callback) {
    const meth = 'adapter-iapRunAdapterBasicGet';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapRunAdapterBasicGet(callback);
    } catch (error) {
      log.error(`${origin}: ${error}`);
      return callback(null, error);
    }
  }

  /**
   * @summary moves entites into Mongo DB
   *
   * @function iapMoveAdapterEntitiesToDB
   * @param {getCallback} callback - a callback function to return the result (Generics)
   *                                  or the error
   */
  iapMoveAdapterEntitiesToDB(callback) {
    const meth = 'adapter-iapMoveAdapterEntitiesToDB';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapMoveAdapterEntitiesToDB(callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /**
   * @summary Deactivate adapter tasks
   *
   * @function iapDeactivateTasks
   *
   * @param {Array} tasks - List of tasks to deactivate
   * @param {Callback} callback
   */
  iapDeactivateTasks(tasks, callback) {
    const meth = 'adapter-iapDeactivateTasks';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapDeactivateTasks(tasks, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /**
   * @summary Activate adapter tasks that have previously been deactivated
   *
   * @function iapActivateTasks
   *
   * @param {Array} tasks - List of tasks to activate
   * @param {Callback} callback
   */
  iapActivateTasks(tasks, callback) {
    const meth = 'adapter-iapActivateTasks';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapActivateTasks(tasks, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /* CACHE CALLS */
  /**
   * @summary Populate the cache for the given entities
   *
   * @function iapPopulateEntityCache
   * @param {String/Array of Strings} entityType - the entity type(s) to populate
   * @param {Callback} callback - whether the cache was updated or not for each entity type
   *
   * @returns status of the populate
   */
  iapPopulateEntityCache(entityTypes, callback) {
    const meth = 'adapter-iapPopulateEntityCache';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapPopulateEntityCache(entityTypes, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
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
    const meth = 'adapter-iapCheckEiapRetrieveEntitiesCachentityCached';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapRetrieveEntitiesCache(entityType, options, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /* BROKER CALLS */
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
    const meth = 'adapter-hasEntities';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.hasEntities(entityType, entityList, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
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
    const meth = 'adapter-getDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.getDevice(deviceName, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
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
    const meth = 'adapter-getDevicesFiltered';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.getDevicesFiltered(options, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
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
    const meth = 'adapter-isAlive';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.isAlive(deviceName, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
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
    const meth = 'adapter-getConfig';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.getConfig(deviceName, format, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
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
    const meth = 'adapter-iapGetDeviceCount';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapGetDeviceCount(callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /* GENERIC ADAPTER REQUEST - allows extension of adapter without new calls being added */
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
    const meth = 'adapter-iapExpandedGenericAdapterRequest';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.iapExpandedGenericAdapterRequest(metadata, uriPath, restMethod, pathVars, queryData, requestBody, addlHeaders, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
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
    const meth = 'adapter-genericAdapterRequest';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.genericAdapterRequest(uriPath, restMethod, queryData, requestBody, addlHeaders, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
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
    const meth = 'adapter-genericAdapterRequestNoBasePath';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    try {
      return super.genericAdapterRequestNoBasePath(uriPath, restMethod, queryData, requestBody, addlHeaders, callback);
    } catch (err) {
      log.error(`${origin}: ${err}`);
      return callback(null, err);
    }
  }

  /* INVENTORY CALLS */
  /**
   * @summary run the adapter lint script to return the results.
   *
   * @function iapRunAdapterLint
   * @param {Callback} callback - callback function
   */
  iapRunAdapterLint(callback) {
    const meth = 'adapter-iapRunAdapterLint';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    return super.iapRunAdapterLint(callback);
  }

  /**
   * @summary run the adapter test scripts (baseunit and unit) to return the results.
   *    can not run integration as there can be implications with that.
   *
   * @function iapRunAdapterTests
   * @param {Callback} callback - callback function
   */
  iapRunAdapterTests(callback) {
    const meth = 'adapter-iapRunAdapterTests';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    return super.iapRunAdapterTests(callback);
  }

  /**
   * @summary provide inventory information abbout the adapter
   *
   * @function iapGetAdapterInventory
   * @param {Callback} callback - callback function
   */
  iapGetAdapterInventory(callback) {
    const meth = 'adapter-iapGetAdapterInventory';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    return super.iapGetAdapterInventory(callback);
  }

  /**
   * @callback healthCallback
   * @param {Object} result - the result of the get request (contains an id and a status)
   */
  /**
   * @callback getCallback
   * @param {Object} result - the result of the get request (entity/ies)
   * @param {String} error - any error that occurred
   */
  /**
   * @callback createCallback
   * @param {Object} item - the newly created entity
   * @param {String} error - any error that occurred
   */
  /**
   * @callback updateCallback
   * @param {String} status - the status of the update action
   * @param {String} error - any error that occurred
   */
  /**
   * @callback deleteCallback
   * @param {String} status - the status of the delete action
   * @param {String} error - any error that occurred
   */

  /**
   * @summary Retrieves the record identified by the specified sys_id from the specified table.
   *
   * @function queryTableByNameAndId
   * @param {string} tableName - Name of the table from which to retrieve the records.
   * @param {string} recordId - Unique identifier of the record to retrieve.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  queryTableByNameAndId(tableName, recordId, callback) {
    const meth = 'adapter-queryTableByNameAndId';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (tableName === undefined || tableName === null || tableName === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['tableName'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (recordId === undefined || recordId === null || recordId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['recordId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [tableName, recordId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Table', 'queryTableByNameAndId', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['queryTableByNameAndId'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves all the record in the table
   *
   * @function queryTableByName
   * @param {string} tableName - Name of the table from which to retrieve the records.
   * @param {object} sysparmQuery - e.g. { number: 'CHG12345' }
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  queryTableByName(tableName, sysparmQuery, callback) {
    const meth = 'adapter-queryTableByName';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    return this.queryTableByNameWithLimit(tableName, sysparmQuery, null, null, null, callback);
  }

  /**
   * @summary Retrieves all the record in the table
   *
   * @function queryTableByNameWithLimit
   * @param {string} tableName - Name of the table from which to retrieve the records.
   * @param {object} sysparmQueryKeyValuePairs - e.g. { number: 'CHG12345' }
   * @param {string} sysparmQueryString - e.g. number=CHG12345
   * @param {number} sysparmLimit - e.g. 5
   * @param {string} sysparmFields - e.g. comma separated field names
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  queryTableByNameWithLimit(tableName, sysparmQueryKeyValuePairs, sysparmQueryString, sysparmLimit, sysparmFields, callback) {
    const meth = 'adapter-queryTableByNameWithLimit';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (tableName === undefined || tableName === null || tableName === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['tableName'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = { ...sysparmQueryKeyValuePairs, sysparmQuery: sysparmQueryString, sysparmLimit, sysparmFields };
    const pathVars = [tableName];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Table', 'queryTableByName', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['queryTableByName'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Inserts one record in the specified table. Multiple record insertion is not supported by this method.
   *
   * @function createRecordInTable
   * @param {string} tableName - Name of the table from which to retrieve the records.
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createRecordInTable(tableName, body, callback) {
    const meth = 'adapter-createRecordInTable';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (tableName === undefined || tableName === null || tableName === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['tableName'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [tableName];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Table', 'createRecordInTable', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createRecordInTable'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Updates the specified record with the request body.
   *
   * @function updateTableRecord
   * @param {string} tableName - Name of the table from which to retrieve the records.
   * @param {string} recordId - Unique identifier of the record to retrieve.
   * @param {object} body - name-value pairs for the field(s) to update in the associated table. For example, to update the short description file, enter a name-value pair similar to the following: ...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  updateTableRecord(tableName, recordId, body, callback) {
    const meth = 'adapter-updateTableRecord';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (tableName === undefined || tableName === null || tableName === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['tableName'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (recordId === undefined || recordId === null || recordId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['recordId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [tableName, recordId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Table', 'updateTableRecord', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['updateTableRecord'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Deletes the specified record from the specified table.
   *
   * @function deleteTableRecord
   * @param {string} tableName - Name of the table from which to retrieve the records.
   * @param {string} recordId - Unique identifier of the record to retrieve.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteTableRecord(tableName, recordId, callback) {
    const meth = 'adapter-deleteTableRecord';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (tableName === undefined || tableName === null || tableName === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['tableName'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (recordId === undefined || recordId === null || recordId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['recordId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [tableName, recordId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Table', 'deleteTableRecord', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteTableRecord'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Gets the state of a provided agent’s presence.
   *
   * @function getAgentPresence
   * @param {string} agentId - The id of the user listed in sys_user table.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getAgentPresence(agentId, callback) {
    const meth = 'adapter-getAgentPresence';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (agentId === undefined || agentId === null || agentId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['agentId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [agentId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('AgentPresence', 'getAgentPresence', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getAgentPresence'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Sets the state of a provided agent’s presence and sets the agent’s channel availability for that state (if provided).
   *
   * @function setAgentPresence
   * @param {string} agentId - The id of the user listed in sys_user table.
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  setAgentPresence(agentId, body, callback) {
    const meth = 'adapter-setAgentPresence';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (agentId === undefined || agentId === null || agentId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['agentId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [agentId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('AgentPresence', 'setAgentPresence', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['setAgentPresence'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves one or more standard change requests based on the specified criteria.
   *
   * @function getStandardChangeRequest
   * @param {object} sysparmQuery - Encoded query used to filter the result set. e.g. { change: 'CHG123456' }
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getStandardChangeRequest(sysparmQuery, callback) {
    const meth = 'adapter-getStandardChangeRequest';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeManagement', 'getStandardChangeRequest', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getStandardChangeRequest'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves the standard change request identified by the specified sys_id.
   *
   * @function getStandardChangeRequestById
   * @param {object} sysparmQuery - Encoded query used to filter the result set. e.g. { change: 'CHG123456' }
   * @param {string} changeId - Unique identifier of the standard change request to retrieve from the [change_request] table.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getStandardChangeRequestById(sysparmQuery, changeId, callback) {
    const meth = 'adapter-getStandardChangeRequestById';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (changeId === undefined || changeId === null || changeId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['changeId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [changeId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeManagement', 'getStandardChangeRequestById', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getStandardChangeRequestById'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Deletes the standard change request identified by the specified sys_id.
   *
   * @function deleteStandardChangeRequestById
   * @param {object} sysparmQuery - Encoded query used to filter the result set. e.g. { change: 'CHG123456' }
   * @param {string} changeId - Unique identifier of the standard change request to retrieve from the [change_request] table.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteStandardChangeRequestById(sysparmQuery, changeId, callback) {
    const meth = 'adapter-deleteStandardChangeRequestById';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (changeId === undefined || changeId === null || changeId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['changeId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [changeId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeManagement', 'deleteStandardChangeRequestById', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteStandardChangeRequestById'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves one or more standard change templates based on the specified criteria.
   *
   * @function getStandardChangeTemplate
   * @param {object} sysparmQuery - Encoded query used to filter the result set.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getStandardChangeTemplate(sysparmQuery, callback) {
    const meth = 'adapter-getStandardChangeTemplate';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeManagement', 'getStandardChangeTemplate', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getStandardChangeTemplate'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves the standard change template identified by the specified sys_id.
   *
   * @function getStandardChangeTemplateById
   * @param {object} sysparmQuery - Encoded query used to filter the result set.
   * @param {string} changeId - Unique identifier of the standard change template to retrieve from the [std_change_record_producer] table.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getStandardChangeTemplateById(sysparmQuery, changeId, callback) {
    const meth = 'adapter-getStandardChangeTemplateById';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (changeId === undefined || changeId === null || changeId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['changeId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [changeId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeManagement', 'getStandardChangeTemplateById', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getStandardChangeTemplateById'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Creates one standard change request based on an existing standard change template.
   *
   * @function changeStandardTemplateById
   * @param {string} standardChangeTemplateId - Unique identifier of the standard change template on which to base the new standard change request (from [std_change_record_producer] table).
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  changeStandardTemplateById(standardChangeTemplateId, callback) {
    const meth = 'adapter-changeStandardTemplateById';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (standardChangeTemplateId === undefined || standardChangeTemplateId === null || standardChangeTemplateId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['standardChangeTemplateId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [standardChangeTemplateId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeManagement', 'changeStandardTemplateById', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['changeStandardTemplateById'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves one or more normal change requests based on the specified criteria
   *
   * @function getNormalChangeRequest
   * @param {object} sysparmQuery - Encoded query used to filter the result set.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getNormalChangeRequest(sysparmQuery, callback) {
    const meth = 'adapter-getNormalChangeRequest';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeManagement', 'getNormalChangeRequest', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getNormalChangeRequest'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves the normal change request identified by the specified sys_id.
   *
   * @function getNormalChangeRequestById
   * @param {object} sysparmQuery - Encoded query used to filter the result set. e.g. { change: 'CHG123456' }
   * @param {string} changeId - Unique identifier of the standard change request to retrieve from the [change_request] table.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getNormalChangeRequestById(sysparmQuery, changeId, callback) {
    const meth = 'adapter-getNormalChangeRequestById';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (changeId === undefined || changeId === null || changeId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['changeId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [changeId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeManagement', 'getNormalChangeRequestById', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getNormalChangeRequestById'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Creates one normal change request based on the default normal change request record.
   *
   * @function createNormalChangeRequest
   * @param {object} change - The change request information to create
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createNormalChangeRequest(change, callback) {
    const meth = 'adapter-createNormalChangeRequest';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (change === undefined || change === null || change === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['change'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = change;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeManagement', 'createNormalChangeRequest', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createNormalChangeRequest'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Updates one normal change request based on the default normal change request record.
   *
   * @function updateNormalChangeRequestById
   * @param {string} changeId - Unique identifier of the standard change request to update from the [change_request] table.
   * @param {object} change - The change request information to update
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  updateNormalChangeRequestById(changeId, change, callback) {
    const meth = 'adapter-updateNormalChangeRequestById';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (changeId === undefined || changeId === null || changeId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['changeId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (change === undefined || change === null || change === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['change'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [changeId];
    const bodyVars = change;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeManagement', 'updateNormalChangeRequestById', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['updateNormalChangeRequestById'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Deletes the normal change request identified by the specified sys_id.
   *
   * @function deleteNormalChangeRequestById
   * @param {object} sysparmQuery - Encoded query used to filter the result set. e.g. { change: 'CHG123456' }
   * @param {string} changeId - Unique identifier of the standard change request to retrieve from the [change_request] table.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteNormalChangeRequestById(sysparmQuery, changeId, callback) {
    const meth = 'adapter-deleteNormalChangeRequestById';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (changeId === undefined || changeId === null || changeId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['changeId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [changeId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeManagement', 'deleteNormalChangeRequestById', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteNormalChangeRequestById'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves one or more emergency change requests based on the specified criteria.
   *
   * @function getEmergencyChangeRequest
   * @param {object} sysparmQuery - Encoded query used to filter the result set.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getEmergencyChangeRequest(sysparmQuery, callback) {
    const meth = 'adapter-getEmergencyChangeRequest';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeManagement', 'getEmergencyChangeRequest', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getEmergencyChangeRequest'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves the emergency change request identified by the specified sys_id.
   *
   * @function getEmergencyChangeRequestById
   * @param {object} sysparmQuery - Encoded query used to filter the result set. e.g. { change: 'CHG123456' }
   * @param {string} changeId - Unique identifier of the standard change request to retrieve from the [change_request] table.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getEmergencyChangeRequestById(sysparmQuery, changeId, callback) {
    const meth = 'adapter-getEmergencyChangeRequestById';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (changeId === undefined || changeId === null || changeId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['changeId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [changeId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeManagement', 'getEmergencyChangeRequestById', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getEmergencyChangeRequestById'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Creates one emergency change request based on the default emergency change request record.
   *
   * @function createEmergencyChangeRequest
   * @param {object} sysparmQuery - Encoded query used to filter the result set. e.g. { change: 'CHG123456' }
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createEmergencyChangeRequest(sysparmQuery, callback) {
    const meth = 'adapter-createEmergencyChangeRequest';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeManagement', 'createEmergencyChangeRequest', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createEmergencyChangeRequest'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Deletes the emergency change request identified by the specified sys_id.
   *
   * @function deleteEmergencyChangeRequestById
   * @param {object} sysparmQuery - Encoded query used to filter the result set. e.g. { change: 'CHG123456' }
   * @param {string} changeId - Unique identifier of the standard change request to retrieve from the [change_request] table.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteEmergencyChangeRequestById(sysparmQuery, changeId, callback) {
    const meth = 'adapter-deleteEmergencyChangeRequestById';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (changeId === undefined || changeId === null || changeId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['changeId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [changeId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeManagement', 'deleteEmergencyChangeRequestById', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteEmergencyChangeRequestById'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves one or more tasks associated with a specified change request based on the specified criteria.
   *
   * @function getChangeRequestTask
   * @param {object} sysparmQuery - Encoded query used to filter the result set.
   * @param {string} changeId - Unique identifier of the change request to which to associate this task (from [change_request] table).
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getChangeRequestTask(sysparmQuery, changeId, callback) {
    const meth = 'adapter-getChangeRequestTask';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (changeId === undefined || changeId === null || changeId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['changeId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [changeId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeManagement', 'getChangeRequestTask', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getChangeRequestTask'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves the task for the change request identified by the specified sys_ids.
   *
   * @function getChangeTaskByTaskId
   * @param {object} sysparmQuery - Encoded query used to filter the result set. e.g. { change: 'CHG123456' }
   * @param {string} changeId - Unique identifier of the change request to which the specified task is associated (from [change_request] table). Verifies that the specified task is associated with the s...(description truncated)
   * @param {string} taskId - Unique identifier of the task to retrieve (from [change_task] table).
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getChangeTaskByTaskId(sysparmQuery, changeId, taskId, callback) {
    const meth = 'adapter-getChangeTaskByTaskId';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (changeId === undefined || changeId === null || changeId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['changeId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (taskId === undefined || taskId === null || taskId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['taskId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [changeId, taskId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeManagement', 'getChangeTaskByTaskId', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getChangeTaskByTaskId'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Creates one change request task based on the default change request task record.
   *
   * @function createChangeRequestTask
   * @param {object} sysparmQuery - Encoded query used to filter the result set. e.g. { change: 'CHG123456' }
   * @param {string} changeId - Unique identifier of the change request to which to associate this task (from [change_request] table).
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createChangeRequestTask(sysparmQuery, changeId, callback) {
    const meth = 'adapter-createChangeRequestTask';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (changeId === undefined || changeId === null || changeId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['changeId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [changeId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeManagement', 'createChangeRequestTask', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createChangeRequestTask'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Deletes the change request task identified by the specified sys_ids.
   *
   * @function deleteChangeTaskByTaskId
   * @param {object} sysparmQuery - Encoded query used to filter the result set. e.g. { change: 'CHG123456' }
   * @param {string} changeId - Unique identifier of the change request to which the specified task is associated (from [change_request] table). Verifies that the specified task is associated with the s...(description truncated)
   * @param {string} taskId - Unique identifier of the task to retrieve (from [change_task] table).
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteChangeTaskByTaskId(sysparmQuery, changeId, taskId, callback) {
    const meth = 'adapter-deleteChangeTaskByTaskId';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (changeId === undefined || changeId === null || changeId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['changeId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (taskId === undefined || taskId === null || taskId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['taskId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [changeId, taskId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeManagement', 'deleteChangeTaskByTaskId', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteChangeTaskByTaskId'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves the status of the currently running change request conflict checking process
   *
   * @function getChangeRequestConflict
   * @param {object} sysparmQuery - Encoded query used to filter the result set. e.g. { change: 'CHG123456' }
   * @param {string} changeId - Unique identifier of the change management request for which to start the conflict checking process (from [change_request] table). For additional information on the confl...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getChangeRequestConflict(sysparmQuery, changeId, callback) {
    const meth = 'adapter-getChangeRequestConflict';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (changeId === undefined || changeId === null || changeId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['changeId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [changeId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeManagement', 'getChangeRequestConflict', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getChangeRequestConflict'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Starts a change request conflict checking process for the specified change request (sys_id).
   *
   * @function createChangeRequestConflict
   * @param {object} sysparmQuery - Encoded query used to filter the result set. e.g. { change: 'CHG123456' }
   * @param {string} changeId - Unique identifier of the change management request for which to start the conflict checking process (from [change_request] table). For additional information on the confl...(description truncated)
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createChangeRequestConflict(sysparmQuery, changeId, callback) {
    const meth = 'adapter-createChangeRequestConflict';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (changeId === undefined || changeId === null || changeId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['changeId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [changeId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeManagement', 'createChangeRequestConflict', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createChangeRequestConflict'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Cancels the running conflict checking process for the specified change request (sys_id).
   *
   * @function cancelChangeRequestConflict
   * @param {object} sysparmQuery - Encoded query used to filter the result set. e.g. { change: 'CHG123456' }
   * @param {string} changeId - Unique identifier of the standard change request to retrieve from the [change_request] table.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  cancelChangeRequestConflict(sysparmQuery, changeId, callback) {
    const meth = 'adapter-cancelChangeRequestConflict';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (changeId === undefined || changeId === null || changeId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['changeId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [changeId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeManagement', 'cancelChangeRequestConflict', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['cancelChangeRequestConflict'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary This method retrieves the specified import staging record and resulting transformation result.
   *
   * @function getImportById
   * @param {string} tableName - tableName
   * @param {string} importId - id
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getImportById(tableName, importId, callback) {
    const meth = 'adapter-getImportById';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (tableName === undefined || tableName === null || tableName === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['tableName'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (importId === undefined || importId === null || importId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['importId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [tableName, importId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ImportSet', 'getImportById', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getImportById'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Inserts incoming data into a specified staging table.
   *
   * @function importIntoTable
   * @param {string} tableName - tableName
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  importIntoTable(tableName, body, callback) {
    const meth = 'adapter-importIntoTable';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (tableName === undefined || tableName === null || tableName === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['tableName'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [tableName];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ImportSet', 'importIntoTable', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['importIntoTable'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieve a list of CIs in an application service and the relationships between them.
   *
   * @function getApplicationById
   * @param {string} appId - application id (required)
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getApplicationById(appId, callback) {
    const meth = 'adapter-getApplicationById';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (appId === undefined || appId === null || appId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['appId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [appId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ApplicationService', 'getApplicationById', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getApplicationById'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Create an application service or update an existing application service.
   *
   * @function createApplication
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createApplication(body, callback) {
    const meth = 'adapter-createApplication';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ApplicationService', 'createApplication', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createApplication'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary This method returns the record details of the specified email record.
   *
   * @function getEmail
   * @param {string} emailId - emailId
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getEmail(emailId, callback) {
    const meth = 'adapter-getEmail';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (emailId === undefined || emailId === null || emailId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['emailId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [emailId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Email', 'getEmail', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getEmail'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary This method creates the email record specified in the request body.
   *
   * @function createEmail
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createEmail(body, callback) {
    const meth = 'adapter-createEmail';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Email', 'createEmail', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createEmail'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Adds or updates tokens that enable devices to receive push notifications from the specified application.
   *
   * @function pushInstallation
   * @param {string} pushApplicationName - Name of the application for which to register the push notifications. This parameter must be the same as the value in the Name column for the associated application in th...(description truncated)
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  pushInstallation(pushApplicationName, body, callback) {
    const meth = 'adapter-pushInstallation';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (pushApplicationName === undefined || pushApplicationName === null || pushApplicationName === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['pushApplicationName'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [pushApplicationName];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('PushInstallation', 'pushInstallation', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['pushInstallation'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Adds or updates tokens that enable devices to receive push notifications from the specified application.
   *
   * @function removeInstallation
   * @param {string} pushApplicationName - Name of the application for which to register the push notifications. This parameter must be the same as the value in the Name column for the associated application in th...(description truncated)
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  removeInstallation(pushApplicationName, body, callback) {
    const meth = 'adapter-removeInstallation';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (pushApplicationName === undefined || pushApplicationName === null || pushApplicationName === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['pushApplicationName'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [pushApplicationName];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('PushInstallation', 'removeInstallation', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['removeInstallation'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieve time series data from the MetricBase database.
   *
   * @function getMetricBase
   * @param {string} table - Name of the table containing the GlideRecord associated with this series.
   * @param {string} subject - The sys_id of the GlideRecord associated with this series.
   * @param {string} metric - The field name of the metric.
   * @param {string} sysparmEnd - The end time of the evaluation period in UTC. The value must be in ISO date format up to seconds. For example, 2017-03-20T17:04:55.
   * @param {string} sysparmStart - The start time of the evaluation period in UTC. The value must be in ISO date format up to seconds. For example, 2017-03-20T17:04:55.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getMetricBase(table, subject, metric, sysparmEnd, sysparmStart, callback) {
    const meth = 'adapter-getMetricBase';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (table === undefined || table === null || table === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['table'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (subject === undefined || subject === null || subject === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['subject'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (metric === undefined || metric === null || metric === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['metric'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (sysparmEnd === undefined || sysparmEnd === null || sysparmEnd === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['sysparmEnd'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (sysparmStart === undefined || sysparmStart === null || sysparmStart === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['sysparmStart'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { sysparmEnd, sysparmStart };
    const queryParams = {};
    const pathVars = [table, subject, metric];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('MetricBaseTimeSeries', 'getMetricBase', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getMetricBase'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Adds time-series data to the MetricBase database.
   *
   * @function createMetricBase
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createMetricBase(body, callback) {
    const meth = 'adapter-createMetricBase';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('MetricBaseTimeSeries', 'createMetricBase', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createMetricBase'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Transforms selected data.
   *
   * @function transformMetricBase
   * @param {string} table - Name of the table containing the GlideRecord associated with this series.
   * @param {string} metric - The field name of the metric.
   * @param {string} sysparmEnd - The end time of the evaluation period in UTC. The value must be in ISO date format up to seconds. For example, 2017-03-20T17:04:55.
   * @param {string} sysparmStart - The start time of the evaluation period in UTC. The value must be in ISO date format up to seconds. For example, 2017-03-20T17:04:55.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  transformMetricBase(table, metric, sysparmEnd, sysparmStart, callback) {
    const meth = 'adapter-transformMetricBase';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (table === undefined || table === null || table === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['table'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (metric === undefined || metric === null || metric === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['metric'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (sysparmEnd === undefined || sysparmEnd === null || sysparmEnd === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['sysparmEnd'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (sysparmStart === undefined || sysparmStart === null || sysparmStart === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['sysparmStart'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { sysparmEnd, sysparmStart };
    const queryParams = {};
    const pathVars = [table, metric];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('MetricBaseTimeSeries', 'transformMetricBase', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['transformMetricBase'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary This method retrieves records for the specified table and performs aggregate functions on the returned values.
   *
   * @function getAggregate
   * @param {object} sysparmQuery - An encoded query.
   * @param {string} tableName - tableName
   * @param {object} aggregate - how to aggregate the results
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getAggregate(sysparmQuery, tableName, aggregate, callback) {
    const meth = 'adapter-getAggregate';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (sysparmQuery === undefined || sysparmQuery === null || sysparmQuery === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['sysparmQuery'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (tableName === undefined || tableName === null || tableName === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['tableName'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (aggregate === undefined || aggregate === null || aggregate === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['aggregate'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [tableName];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      uriOptions: aggregate
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Aggregate', 'getAggregate', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getAggregate'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary If an active work item exists, routes a document to a queue.
   *
   * @function createQueue
   * @param {string} queueId - Unique ID of the queue record from the awa_queue table.
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createQueue(queueId, body, callback) {
    const meth = 'adapter-createQueue';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (queueId === undefined || queueId === null || queueId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['queueId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [queueId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Queue', 'createQueue', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createQueue'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns a specified user's granted and inherited roles.
   *
   * @function getUserRoles
   * @param {string} userId - Required. id of the user for which to return role information.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getUserRoles(userId, callback) {
    const meth = 'adapter-getUserRoles';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (userId === undefined || userId === null || userId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['userId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { userId };
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UserRoleInheritance', 'getUserRoles', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getUserRoles'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary This method retrieves details about indicators from the Analytics Hub.
   *
   * @function getPerformanceAnalytics
   * @param {string} sysparmUuid - Enter a colon-separated list of sys_id values to specify which indicators, breakdowns, aggregates, and domains to query.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getPerformanceAnalytics(sysparmUuid, callback) {
    const meth = 'adapter-getPerformanceAnalytics';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (sysparmUuid === undefined || sysparmUuid === null || sysparmUuid === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['sysparmUuid'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { sysparmUuid };
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('PerformanceAnalytics', 'getPerformanceAnalytics', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getPerformanceAnalytics'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary This method returns the list of channels for a given task record.
   *
   * @function getChannelsForTable
   * @param {string} sysparmTable - Table name of task.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getChannelsForTable(sysparmTable, callback) {
    const meth = 'adapter-getChannelsForTable';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (sysparmTable === undefined || sysparmTable === null || sysparmTable === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['sysparmTable'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { sysparmTable };
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('TaskCommunicationManagement', 'getChannelsForTable', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getChannelsForTable'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary This method returns meta data of all channels associated with a given communication task id and table.
   *
   * @function getChannelsForTableByTaskId
   * @param {string} commTaskId - Sys id of communication task.
   * @param {string} table - Name of the table defined in the comm_task_handler table.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getChannelsForTableByTaskId(commTaskId, table, callback) {
    const meth = 'adapter-getChannelsForTableByTaskId';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (commTaskId === undefined || commTaskId === null || commTaskId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['commTaskId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (table === undefined || table === null || table === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['table'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [commTaskId, table];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('TaskCommunicationManagement', 'getChannelsForTableByTaskId', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getChannelsForTableByTaskId'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary This method returns list of communication plans that includes communication tasks and channels.
   *
   * @function getCommunicationGroupPlans
   * @param {string} taskId - Sys id of the task.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getCommunicationGroupPlans(taskId, callback) {
    const meth = 'adapter-getCommunicationGroupPlans';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (taskId === undefined || taskId === null || taskId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['taskId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [taskId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('TaskCommunicationManagement', 'getCommunicationGroupPlans', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getCommunicationGroupPlans'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary This method returns list of communication plans that includes communication tasks and channels.
   *
   * @function getCommunicationPlans
   * @param {string} taskId - Sys id of the task.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getCommunicationPlans(taskId, callback) {
    const meth = 'adapter-getCommunicationPlans';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (taskId === undefined || taskId === null || taskId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['taskId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [taskId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('TaskCommunicationManagement', 'getCommunicationPlans', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getCommunicationPlans'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary This method manages the recipients of a communication plan.
   *
   * @function manageCommunicationRecipients
   * @param {string} sysparmTable - Table name of task.
   * @param {string} commPlanId - Sys id of the communication plan.
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  manageCommunicationRecipients(sysparmTable, commPlanId, body, callback) {
    const meth = 'adapter-manageCommunicationRecipients';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (sysparmTable === undefined || sysparmTable === null || sysparmTable === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['sysparmTable'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (commPlanId === undefined || commPlanId === null || commPlanId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['commPlanId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { sysparmTable };
    const queryParams = {};
    const pathVars = [commPlanId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('TaskCommunicationManagement', 'manageCommunicationRecipients', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['manageCommunicationRecipients'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Create a communication plan and communication task instance
   *
   * @function createCommunicationPlan
   * @param {string} sysparmTable - Table name of task.
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createCommunicationPlan(sysparmTable, body, callback) {
    const meth = 'adapter-createCommunicationPlan';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (sysparmTable === undefined || sysparmTable === null || sysparmTable === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['sysparmTable'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { sysparmTable };
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('TaskCommunicationManagement', 'createCommunicationPlan', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createCommunicationPlan'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary This method returns success status if the channel task is successfully completed.
   *
   * @function getCommunicationTaskState
   * @param {string} commTaskId - Sys id of communication task.
   * @param {string} table - Name of the table defined in the comm_task_handler table.
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getCommunicationTaskState(commTaskId, table, body, callback) {
    const meth = 'adapter-getCommunicationTaskState';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (commTaskId === undefined || commTaskId === null || commTaskId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['commTaskId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (table === undefined || table === null || table === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['table'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [commTaskId, table];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('TaskCommunicationManagement', 'getCommunicationTaskState', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getCommunicationTaskState'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary This method is used to create a communication task instance.
   *
   * @function createCommunicationTask
   * @param {string} sysparmTable - Table name of task.
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createCommunicationTask(sysparmTable, body, callback) {
    const meth = 'adapter-createCommunicationTask';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (sysparmTable === undefined || sysparmTable === null || sysparmTable === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['sysparmTable'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { sysparmTable };
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('TaskCommunicationManagement', 'createCommunicationTask', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createCommunicationTask'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary This method performs specified action on communication tasks.
   *
   * @function updateCommunicationTask
   * @param {string} commTaskId - Sys id of communication task.
   * @param {string} table - Name of the table defined in the comm_task_handler table.
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  updateCommunicationTask(commTaskId, table, body, callback) {
    const meth = 'adapter-updateCommunicationTask';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (commTaskId === undefined || commTaskId === null || commTaskId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['commTaskId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (table === undefined || table === null || table === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['table'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [commTaskId, table];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('TaskCommunicationManagement', 'updateCommunicationTask', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['updateCommunicationTask'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary This method gets the metadata for the attachment file with a specific sys_id value.
   *
   * @function getAttachmentMetadataById
   * @param {string} attachId - The id of the attachment record you want to get metadata for.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getAttachmentMetadataById(attachId, callback) {
    const meth = 'adapter-getAttachmentMetadataById';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (attachId === undefined || attachId === null || attachId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['attachId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [attachId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Attachment', 'getAttachmentMetadataById', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getAttachmentMetadataById'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary This method gets the binary file attachment with a specific sys_id value.
   *
   * @function getAttachmentBinaryById
   * @param {string} attachId - The id of the attachment record you want to get metadata for.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getAttachmentBinaryById(attachId, callback) {
    const meth = 'adapter-getAttachmentBinaryById';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (attachId === undefined || attachId === null || attachId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['attachId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [attachId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: { Accept: '*/*' }
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Attachment', 'getAttachmentBinaryById', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getAttachmentBinaryById'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary This method gets the metadata for multiple attachments.
   *
   * @function getAttachmentsMetadata
   * @param {object} sysparmQuery - e.g. { table_sys_id: 'c83c5e5347c12200e0ef563dbb9a7190' }
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getAttachmentsMetadata(sysparmQuery, callback) {
    const meth = 'adapter-getAttachmentsMetadata';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Attachment', 'getAttachmentsMetadata', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getAttachmentsMetadata'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary This method uploads a binary file specified in the request body as an attachment.
   *
   * @function uploadAttachment
   * @param {string} encryptionContext - The sys_id of an encryption context record. Specify this parameter to allow only users with the specified encryption context to access the attachment. If you do not speci...(description truncated)
   * @param {string} fileName - The name to give the attachment. This parameter is required to post an attachment.
   * @param {string} tableName - The name of the table you want to attach the file to. This parameter is required to post an attachment.
   * @param {string} tableId - The id of the record on the specified table that you want to attach the file to. This parameter is required to post an attachment.
   * @param {string} bodyFormData - bodyFormData param
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  uploadAttachment(encryptionContext, fileName, tableName, tableId, bodyFormData, callback) {
    const meth = 'adapter-uploadAttachment';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (fileName === undefined || fileName === null || fileName === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['fileName'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (tableName === undefined || tableName === null || tableName === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['tableName'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (tableId === undefined || tableId === null || tableId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['tableId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (bodyFormData === undefined || bodyFormData === null || bodyFormData === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['bodyFormData'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { encryptionContext, fileName, tableName, tableId };
    const queryParams = {};
    const pathVars = [];
    const bodyVars = bodyFormData;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Attachment', 'uploadAttachment', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['uploadAttachment'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary This method uploads a multipart file attachment.
   *
   * @function uploadMultipartAttachment
   * @param {string} bodyFormData - bodyFormData param
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  uploadMultipartAttachment(bodyFormData, callback) {
    const meth = 'adapter-uploadMultipartAttachment';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (bodyFormData === undefined || bodyFormData === null || bodyFormData === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['bodyFormData'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Attachment', 'uploadMultipartAttachment', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['uploadMultipartAttachment'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary This method deletes the attachment with a specific sys_id value.
   *
   * @function deleteAttachmentById
   * @param {string} attachId - The sys_id of the attachment record you want to get metadata for.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteAttachmentById(attachId, callback) {
    const meth = 'adapter-deleteAttachmentById';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (attachId === undefined || attachId === null || attachId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['attachId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [attachId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Attachment', 'deleteAttachmentById', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteAttachmentById'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves the specified CSM account.
   *
   * @function getCSMAccount
   * @param {string} id - Unique identifier (sys_id) of the account to retrieve; located in the Customer [customer_account] table.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getCSMAccount(id, callback) {
    const meth = 'adapter-getCSMAccount';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('CustomerServiceManagement', 'getCSMAccount', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getCSMAccount'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves a specified set of CSM accounts.
   *
   * @function queryCSMAccounts
   * @param {object} sysparmQuery - Encoded query to use to filter the result set
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  queryCSMAccounts(sysparmQuery, callback) {
    const meth = 'adapter-queryCSMAccounts';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (sysparmQuery === undefined || sysparmQuery === null || sysparmQuery === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['sysparmQuery'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('CustomerServiceManagement', 'queryCSMAccounts', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['queryCSMAccounts'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves the specified CSM case.
   *
   * @function getCSMCase
   * @param {string} id - Unique identifier (sys_id) of the case to retrieve; located in the Case [sn_customerservice_case] table.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getCSMCase(id, callback) {
    const meth = 'adapter-getCSMCase';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('CustomerServiceManagement', 'getCSMCase', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getCSMCase'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves a specified set of CSM cases.
   *
   * @function queryCSMCases
   * @param {object} sysparmQuery - Encoded query to use to filter the result set.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  queryCSMCases(sysparmQuery, callback) {
    const meth = 'adapter-queryCSMCases';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (sysparmQuery === undefined || sysparmQuery === null || sysparmQuery === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['sysparmQuery'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('CustomerServiceManagement', 'queryCSMCases', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['queryCSMCases'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Creates a new CSM case.
   *
   * @function createCSMCase
   * @param {object} sysparmQuery - Encoded query to use to filter the result set.
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createCSMCase(sysparmQuery, body, callback) {
    const meth = 'adapter-createCSMCase';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (sysparmQuery === undefined || sysparmQuery === null || sysparmQuery === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['sysparmQuery'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('CustomerServiceManagement', 'createCSMCase', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createCSMCase'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Updates the specified existing CSM case with the passed-in parameters.
   *
   * @function updateCSMCase
   * @param {string} id - Unique identifier (sys_id) of the case to retrieve; located in the Case [sn_customerservice_case] table.
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  updateCSMCase(id, body, callback) {
    const meth = 'adapter-updateCSMCase';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('CustomerServiceManagement', 'updateCSMCase', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['updateCSMCase'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves the specified CSM consumer record.
   *
   * @function getCSMConsumer
   * @param {string} id - Unique identifier (sys_id) of the account to retrieve; located in the Customer [customer_account] table.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getCSMConsumer(id, callback) {
    const meth = 'adapter-getCSMConsumer';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('CustomerServiceManagement', 'getCSMConsumer', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getCSMConsumer'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves a specified set of CSM consumer records.
   *
   * @function queryCSMConsumers
   * @param {object} sysparmQuery - Encoded query to use to filter the result set.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  queryCSMConsumers(sysparmQuery, callback) {
    const meth = 'adapter-queryCSMConsumers';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (sysparmQuery === undefined || sysparmQuery === null || sysparmQuery === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['sysparmQuery'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('CustomerServiceManagement', 'queryCSMConsumers', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['queryCSMConsumers'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Creates a new CSM consumer.
   *
   * @function createCSMConsumer
   * @param {object} sysparmQuery - Encoded query to use to filter the result set
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createCSMConsumer(sysparmQuery, body, callback) {
    const meth = 'adapter-createCSMConsumer';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('CustomerServiceManagement', 'createCSMConsumer', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createCSMConsumer'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves the specified CSM contact.
   *
   * @function getCSMContact
   * @param {string} id - Unique identifier (sys_id) of the account to retrieve; located in the Customer [customer_account] table.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getCSMContact(id, callback) {
    const meth = 'adapter-getCSMContact';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('CustomerServiceManagement', 'getCSMContact', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getCSMContact'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves a specified set of CSM contacts.
   *
   * @function queryCSMContacts
   * @param {object} sysparmQuery - Encoded query to use to filter the result set.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  queryCSMContacts(sysparmQuery, callback) {
    const meth = 'adapter-queryCSMContacts';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (sysparmQuery === undefined || sysparmQuery === null || sysparmQuery === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['sysparmQuery'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('CustomerServiceManagement', 'queryCSMContacts', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['queryCSMContacts'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Creates a new CSM contact.
   *
   * @function createCSMContact
   * @param {object} sysparmQuery - Encoded query to use to filter the result set
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createCSMContact(sysparmQuery, body, callback) {
    const meth = 'adapter-createCSMContact';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (sysparmQuery === undefined || sysparmQuery === null || sysparmQuery === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['sysparmQuery'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('CustomerServiceManagement', 'createCSMContact', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createCSMContact'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves a list of catalogs to which the user has access based on the passed in parameters.
   *
   * @function getServiceCatalogs
   * @param {number} sysparmLimit - Maximum number of records to return. Unusually large sysparm_limit values can impact system performance.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getServiceCatalogs(sysparmLimit, callback) {
    const meth = 'adapter-getServiceCatalogs';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (sysparmLimit === undefined || sysparmLimit === null || sysparmLimit === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['sysparmLimit'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { sysparmLimit };
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ServiceCatalog', 'getServiceCatalogs', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getServiceCatalogs'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves the available information for a specified catalog.
   *
   * @function getServiceCatalogById
   * @param {number} sysparmLimit - Maximum number of records to return. Unusually large sysparm_limit values can impact system performance.
   * @param {number} catalogId - Unique identifier of the catalog to retrieve.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getServiceCatalogById(sysparmLimit, catalogId, callback) {
    const meth = 'adapter-getServiceCatalogById';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (sysparmLimit === undefined || sysparmLimit === null || sysparmLimit === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['sysparmLimit'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (catalogId === undefined || catalogId === null || catalogId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['catalogId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { sysparmLimit };
    const queryParams = {};
    const pathVars = [catalogId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ServiceCatalog', 'getServiceCatalogById', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getServiceCatalogById'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves the available information for a specified category.
   *
   * @function getServiceCatalogCategoryInformation
   * @param {number} sysparmLimit - Maximum number of records to return. Unusually large sysparm_limit values can impact system performance.
   * @param {number} catalogId - Unique identifier of the catalog to retrieve.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getServiceCatalogCategoryInformation(sysparmLimit, catalogId, callback) {
    const meth = 'adapter-getServiceCatalogCategoryInformation';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (sysparmLimit === undefined || sysparmLimit === null || sysparmLimit === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['sysparmLimit'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (catalogId === undefined || catalogId === null || catalogId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['catalogId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { sysparmLimit };
    const queryParams = {};
    const pathVars = [catalogId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ServiceCatalog', 'getServiceCatalogCategoryInformation', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getServiceCatalogCategoryInformation'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves the list of available categories for the specified catalog.
   *
   * @function getServiceCatalogCategories
   * @param {number} sysparmLimit - Maximum number of records to return. Unusually large sysparm_limit values can impact system performance.
   * @param {number} catalogId - Unique identifier of the catalog to retrieve.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getServiceCatalogCategories(sysparmLimit, catalogId, callback) {
    const meth = 'adapter-getServiceCatalogCategories';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (sysparmLimit === undefined || sysparmLimit === null || sysparmLimit === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['sysparmLimit'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (catalogId === undefined || catalogId === null || catalogId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['catalogId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { sysparmLimit };
    const queryParams = {};
    const pathVars = [catalogId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ServiceCatalog', 'getServiceCatalogCategories', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getServiceCatalogCategories'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves a list of catalog items based on the specified parameters.
   *
   * @function getServiceCatalogItems
   * @param {number} sysparmLimit - Maximum number of records to return. Unusually large sysparm_limit values can impact system performance.
   * @param {string} sysparmCatalog - Catalog sys_id of the item. Use this parameter to locate items in a specific catalog.
   * @param {string} sysparmCategory - Category sys_id of the item. Use this parameter to locate catalog items in a specific category.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getServiceCatalogItems(sysparmLimit, sysparmCatalog, sysparmCategory, callback) {
    const meth = 'adapter-getServiceCatalogItems';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (sysparmLimit === undefined || sysparmLimit === null || sysparmLimit === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['sysparmLimit'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { sysparmLimit, sysparmCatalog, sysparmCategory };
    const queryParams = {};
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ServiceCatalog', 'getServiceCatalogItems', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getServiceCatalogItems'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves a specified catalog item.
   *
   * @function getServiceCatalogItemById
   * @param {number} sysparmLimit - Maximum number of records to return. Unusually large sysparm_limit values can impact system performance.
   * @param {number} catalogId - Unique identifier of the catalog to retrieve.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getServiceCatalogItemById(sysparmLimit, catalogId, callback) {
    const meth = 'adapter-getServiceCatalogItemById';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (sysparmLimit === undefined || sysparmLimit === null || sysparmLimit === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['sysparmLimit'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (catalogId === undefined || catalogId === null || catalogId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['catalogId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = { sysparmLimit };
    const queryParams = {};
    const pathVars = [catalogId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ServiceCatalog', 'getServiceCatalogItemById', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getServiceCatalogItemById'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Adds the specified item to the cart of the current user.
   *
   * @function addItemToCart
   * @param {string} itemId - Unique id of the item to add to the current cart.
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  addItemToCart(itemId, body, callback) {
    const meth = 'adapter-addItemToCart';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (itemId === undefined || itemId === null || itemId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['itemId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [itemId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ServiceCatalog', 'addItemToCart', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['addItemToCart'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves a list of items based on the needs described for an order guide.
   *
   * @function getServiceCatalogOrderItems
   * @param {string} itemId - Unique id of the item to add to the current cart.
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getServiceCatalogOrderItems(itemId, body, callback) {
    const meth = 'adapter-getServiceCatalogOrderItems';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (itemId === undefined || itemId === null || itemId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['itemId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [itemId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ServiceCatalog', 'getServiceCatalogOrderItems', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getServiceCatalogOrderItems'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Creates a record and returns the Table API relative path and redirect URL to access the created record.
   *
   * @function createServiceCatalogRecordGuide
   * @param {string} itemId - Unique id of the item to add to the current cart.
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createServiceCatalogRecordGuide(itemId, body, callback) {
    const meth = 'adapter-createServiceCatalogRecordGuide';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (itemId === undefined || itemId === null || itemId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['itemId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [itemId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ServiceCatalog', 'createServiceCatalogRecordGuide', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createServiceCatalogRecordGuide'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves an array of contents requested for checkout.
   *
   * @function getServiceCatalogCheckoutInformation
   * @param {string} itemId - Unique id of the item to add to the current cart.
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getServiceCatalogCheckoutInformation(itemId, body, callback) {
    const meth = 'adapter-getServiceCatalogCheckoutInformation';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (itemId === undefined || itemId === null || itemId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['itemId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [itemId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ServiceCatalog', 'getServiceCatalogCheckoutInformation', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getServiceCatalogCheckoutInformation'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Orders the specified catalog item.
   *
   * @function orderNowServiceCatalog
   * @param {string} itemId - Unique id of the item to add to the current cart.
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  orderNowServiceCatalog(itemId, body, callback) {
    const meth = 'adapter-orderNowServiceCatalog';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (itemId === undefined || itemId === null || itemId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['itemId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [itemId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ServiceCatalog', 'orderNowServiceCatalog', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['orderNowServiceCatalog'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves the details of the items within the logged in user's cart.
   *
   * @function getServiceCatalogCart
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getServiceCatalogCart(callback) {
    const meth = 'adapter-getServiceCatalogCart';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ServiceCatalog', 'getServiceCatalogCart', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getServiceCatalogCart'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves the shipping address of the specified user.
   *
   * @function getServiceCatalogUserDeliveryAddress
   * @param {string} userId - Unique sys_id of the user whose shipping address is to be retrieved.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getServiceCatalogUserDeliveryAddress(userId, callback) {
    const meth = 'adapter-getServiceCatalogUserDeliveryAddress';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (userId === undefined || userId === null || userId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['userId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [userId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ServiceCatalog', 'getServiceCatalogUserDeliveryAddress', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getServiceCatalogUserDeliveryAddress'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Updates the specified item in the logged in user's cart.
   *
   * @function updateServiceCatalogCart
   * @param {string} cartItemId - Unique identifier of the cart item to update.
   * @param {string} bodyFormData - bodyFormData param
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  updateServiceCatalogCart(cartItemId, bodyFormData, callback) {
    const meth = 'adapter-updateServiceCatalogCart';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (cartItemId === undefined || cartItemId === null || cartItemId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['cartItemId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (bodyFormData === undefined || bodyFormData === null || bodyFormData === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['bodyFormData'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [cartItemId];
    const bodyVars = bodyFormData;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ServiceCatalog', 'updateServiceCatalogCart', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['updateServiceCatalogCart'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Deletes the specified item from the current cart.
   *
   * @function deleteServiceCatalogCartItems
   * @param {string} cartItemId - Unique identifier of the cart item to update.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteServiceCatalogCartItems(cartItemId, callback) {
    const meth = 'adapter-deleteServiceCatalogCartItems';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (cartItemId === undefined || cartItemId === null || cartItemId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['cartItemId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [cartItemId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ServiceCatalog', 'deleteServiceCatalogCartItems', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteServiceCatalogCartItems'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns the display value of the specified variable.
   *
   * @function getServiceCatalogDisplayVariable
   * @param {string} itemId - Unique id of the item to add to the current cart.
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getServiceCatalogDisplayVariable(itemId, body, callback) {
    const meth = 'adapter-getServiceCatalogDisplayVariable';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (itemId === undefined || itemId === null || itemId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['itemId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [itemId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ServiceCatalog', 'getServiceCatalogDisplayVariable', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getServiceCatalogDisplayVariable'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Deletes a specified cart, and the contents of the cart.
   *
   * @function deleteServiceCatalogCart
   * @param {number} cartId - Unique identifier of the catalog to retrieve.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteServiceCatalogCart(cartId, callback) {
    const meth = 'adapter-deleteServiceCatalogCart';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (cartId === undefined || cartId === null || cartId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['cartId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [cartId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ServiceCatalog', 'deleteServiceCatalogCart', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteServiceCatalogCart'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves and processes the checkout for the current cart based on whether the two-step checkout process is enabled.
   *
   * @function checkoutCartServiceCatalog
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  checkoutCartServiceCatalog(callback) {
    const meth = 'adapter-checkoutCartServiceCatalog';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ServiceCatalog', 'checkoutCartServiceCatalog', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['checkoutCartServiceCatalog'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Checks out the user cart, based on the current check-out type (one-step or two-step ).
   *
   * @function submitOrderServiceCatalog
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  submitOrderServiceCatalog(callback) {
    const meth = 'adapter-submitOrderServiceCatalog';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ServiceCatalog', 'submitOrderServiceCatalog', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['submitOrderServiceCatalog'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns the changes from the provided ServiceNow instance.
   *
   * @function getChangeRequests
   * @param {object} sysparmQuery - E.g. { number: 'CHG12345' }
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getChangeRequests(sysparmQuery, callback) {
    const meth = 'adapter-getChangeRequests';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeRequests', 'getChangeRequests', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getChangeRequests'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns the changes from the provided ServiceNow instance.
   *
   * @function getChangeRequestById
   * @param {string} changeId - the id of the change to retrieve. aka sys_id
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getChangeRequestById(changeId, callback) {
    const meth = 'adapter-getChangeRequestById';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (changeId === undefined || changeId === null || changeId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['changeId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [changeId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeRequests', 'getChangeRequestById', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getChangeRequestById'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Creates a change in the provided ServiceNow instance.
   *
   * @function createChangeRequest
   * @param {object} body - the change data to create in ServiceNow
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createChangeRequest(body, callback) {
    const meth = 'adapter-createChangeRequest';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeRequests', 'createChangeRequest', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createChangeRequest'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Updates a change in the provided ServiceNow instance.
   *
   * @function updateChangeRequest
   * @param {string} changeId - the id of the change to retrieve. aka sys_id
   * @param {object} body - the change data to update in ServiceNow
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  updateChangeRequest(changeId, body, callback) {
    const meth = 'adapter-updateChangeRequest';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (changeId === undefined || changeId === null || changeId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['changeId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [changeId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeRequests', 'updateChangeRequest', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['updateChangeRequest'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Deletes the specified record from the specified table.
   *
   * @function deleteChangeRequest
   * @param {string} changeId - the id of the change to retrieve. aka sys_id
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteChangeRequest(changeId, callback) {
    const meth = 'adapter-deleteChangeRequest';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (changeId === undefined || changeId === null || changeId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['changeId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [changeId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeRequests', 'deleteChangeRequest', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteChangeRequest'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns the changes from the provided ServiceNow instance.
   *
   * @function getIncidentById
   * @param {string} incidentId - the id of the change to retrieve. aka sys_id
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getIncidentById(incidentId, callback) {
    const meth = 'adapter-getIncidentById';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (incidentId === undefined || incidentId === null || incidentId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['incidentId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [incidentId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Incidents', 'getIncidentById', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getIncidentById'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns the Incident from the provided ServiceNow instance.
   *
   * @function getIncidents
   * @param {object} sysparmQuery - E.g. { number: 'CHG12345' }
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getIncidents(sysparmQuery, callback) {
    const meth = 'adapter-getIncidents';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Incidents', 'getIncidents', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getIncidents'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Creates a change in the provided ServiceNow instance.
   *
   * @function createIncident
   * @param {object} body - the change data to create in ServiceNow
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createIncident(body, callback) {
    const meth = 'adapter-createIncident';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Incidents', 'createIncident', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createIncident'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Updates a change in the provided ServiceNow instance.
   *
   * @function updateIncident
   * @param {string} incidentId - the id of the change to retrieve. aka sys_id
   * @param {object} body - the change data to update in ServiceNow
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  updateIncident(incidentId, body, callback) {
    const meth = 'adapter-updateIncident';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (incidentId === undefined || incidentId === null || incidentId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['incidentId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [incidentId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Incidents', 'updateIncident', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['updateIncident'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Deletes the specified record from the specified table.
   *
   * @function deleteIncident
   * @param {string} incidentId - the id of the change to retrieve. aka sys_id
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteIncident(incidentId, callback) {
    const meth = 'adapter-deleteIncident';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (incidentId === undefined || incidentId === null || incidentId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['incidentId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [incidentId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Incidents', 'deleteIncident', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteIncident'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns the changes from the provided ServiceNow instance.
   *
   * @function getGroupById
   * @param {string} groupId - the id of the change to retrieve. aka sys_id
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getGroupById(groupId, callback) {
    const meth = 'adapter-getGroupById';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (groupId === undefined || groupId === null || groupId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['groupId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [groupId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Groups', 'getGroupById', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getGroupById'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns the group from the provided ServiceNow instance.
   *
   * @function getGroups
   * @param {object} sysparmQuery - E.g. { name: 'CHG12345' }
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getGroups(sysparmQuery, callback) {
    const meth = 'adapter-getGroups';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Groups', 'getGroups', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getGroups'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Creates a change in the provided ServiceNow instance.
   *
   * @function createGroup
   * @param {object} body - the change data to create in ServiceNow
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createGroup(body, callback) {
    const meth = 'adapter-createGroup';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Groups', 'createGroup', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createGroup'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Updates a change in the provided ServiceNow instance.
   *
   * @function updateGroup
   * @param {string} groupId - the id of the change to retrieve. aka sys_id
   * @param {object} body - the change data to update in ServiceNow
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  updateGroup(groupId, body, callback) {
    const meth = 'adapter-updateGroup';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (groupId === undefined || groupId === null || groupId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['groupId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [groupId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Groups', 'updateGroup', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['updateGroup'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Deletes the specified record from the specified table.
   *
   * @function deleteGroup
   * @param {string} groupId - the id of the change to retrieve. aka sys_id
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteGroup(groupId, callback) {
    const meth = 'adapter-deleteGroup';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (groupId === undefined || groupId === null || groupId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['groupId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [groupId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Groups', 'deleteGroup', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteGroup'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns the changes from the provided ServiceNow instance.
   *
   * @function getConfigItemById
   * @param {string} itemId - the id of the change to retrieve. aka sys_id
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getConfigItemById(itemId, callback) {
    const meth = 'adapter-getConfigItemById';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (itemId === undefined || itemId === null || itemId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['itemId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [itemId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ConfigItems', 'getConfigItemById', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getConfigItemById'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns the ConfigItem from the provided ServiceNow instance.
   *
   * @function getConfigItems
   * @param {object} sysparmQuery - E.g. { number: 'CHG12345' }
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getConfigItems(sysparmQuery, callback) {
    const meth = 'adapter-getConfigItems';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ConfigItems', 'getConfigItems', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getConfigItems'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Creates a change in the provided ServiceNow instance.
   *
   * @function createConfigItem
   * @param {object} body - the change data to create in ServiceNow
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createConfigItem(body, callback) {
    const meth = 'adapter-createConfigItem';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ConfigItems', 'createConfigItem', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createConfigItem'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Updates a change in the provided ServiceNow instance.
   *
   * @function updateConfigItem
   * @param {string} itemId - the id of the change to retrieve. aka sys_id
   * @param {object} body - the change data to update in ServiceNow
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  updateConfigItem(itemId, body, callback) {
    const meth = 'adapter-updateConfigItem';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (itemId === undefined || itemId === null || itemId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['itemId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [itemId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ConfigItems', 'updateConfigItem', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['updateConfigItem'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Deletes the specified record from the specified table.
   *
   * @function deleteConfigItem
   * @param {string} itemId - the id of the change to retrieve. aka sys_id
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteConfigItem(itemId, callback) {
    const meth = 'adapter-deleteConfigItem';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (itemId === undefined || itemId === null || itemId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['itemId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [itemId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ConfigItems', 'deleteConfigItem', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteConfigItem'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns the changes from the provided ServiceNow instance.
   *
   * @function getArticleById
   * @param {string} articleId - the id of the change to retrieve. aka sys_id
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getArticleById(articleId, callback) {
    const meth = 'adapter-getArticleById';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (articleId === undefined || articleId === null || articleId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['articleId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [articleId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('KnowledgeArticles', 'getArticleById', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getArticleById'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns the Article from the provided ServiceNow instance.
   *
   * @function getArticles
   * @param {object} sysparmQuery - E.g. { number: 'CHG12345' }
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getArticles(sysparmQuery, callback) {
    const meth = 'adapter-getArticles';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('KnowledgeArticles', 'getArticles', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getArticles'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Creates a change in the provided ServiceNow instance.
   *
   * @function createArticle
   * @param {object} body - the change data to create in ServiceNow
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createArticle(body, callback) {
    const meth = 'adapter-createArticle';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('KnowledgeArticles', 'createArticle', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createArticle'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Updates a change in the provided ServiceNow instance.
   *
   * @function updateArticle
   * @param {string} articleId - the id of the change to retrieve. aka sys_id
   * @param {object} body - the change data to update in ServiceNow
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  updateArticle(articleId, body, callback) {
    const meth = 'adapter-updateArticle';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (articleId === undefined || articleId === null || articleId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['articleId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [articleId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('KnowledgeArticles', 'updateArticle', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['updateArticle'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Deletes the specified record from the specified table.
   *
   * @function deleteArticle
   * @param {string} articleId - the id of the change to retrieve. aka sys_id
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteArticle(articleId, callback) {
    const meth = 'adapter-deleteArticle';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (articleId === undefined || articleId === null || articleId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['articleId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [articleId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('KnowledgeArticles', 'deleteArticle', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteArticle'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns the changes from the provided ServiceNow instance.
   *
   * @function getProblemById
   * @param {string} problemId - the id of the change to retrieve. aka sys_id
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getProblemById(problemId, callback) {
    const meth = 'adapter-getProblemById';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (problemId === undefined || problemId === null || problemId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['problemId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [problemId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Problems', 'getProblemById', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getProblemById'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns the Problem from the provided ServiceNow instance.
   *
   * @function getProblems
   * @param {object} sysparmQuery - E.g. { number: 'CHG12345' }
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getProblems(sysparmQuery, callback) {
    const meth = 'adapter-getProblems';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Problems', 'getProblems', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getProblems'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Creates a change in the provided ServiceNow instance.
   *
   * @function createProblem
   * @param {object} body - the change data to create in ServiceNow
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createProblem(body, callback) {
    const meth = 'adapter-createProblem';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Problems', 'createProblem', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createProblem'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Updates a change in the provided ServiceNow instance.
   *
   * @function updateProblem
   * @param {string} problemId - the id of the change to retrieve. aka sys_id
   * @param {object} body - the change data to update in ServiceNow
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  updateProblem(problemId, body, callback) {
    const meth = 'adapter-updateProblem';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (problemId === undefined || problemId === null || problemId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['problemId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [problemId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Problems', 'updateProblem', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['updateProblem'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Deletes the specified record from the specified table.
   *
   * @function deleteProblem
   * @param {string} problemId - the id of the change to retrieve. aka sys_id
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteProblem(problemId, callback) {
    const meth = 'adapter-deleteProblem';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (problemId === undefined || problemId === null || problemId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['problemId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [problemId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Problems', 'deleteProblem', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteProblem'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns the changes from the provided ServiceNow instance.
   *
   * @function getRequestsById
   * @param {string} requestId - the id of the change to retrieve. aka sys_id
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getRequestsById(requestId, callback) {
    const meth = 'adapter-getRequestsById';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (requestId === undefined || requestId === null || requestId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['requestId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [requestId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Requests', 'getRequestsById', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getRequestsById'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns the Requests from the provided ServiceNow instance.
   *
   * @function getRequestss
   * @param {object} sysparmQuery - E.g. { number: 'CHG12345' }
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getRequests(sysparmQuery, callback) {
    const meth = 'adapter-getRequests';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Requests', 'getRequests', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getRequests'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Creates a change in the provided ServiceNow instance.
   *
   * @function createRequests
   * @param {object} body - the change data to create in ServiceNow
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createRequests(body, callback) {
    const meth = 'adapter-createRequests';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Requests', 'createRequests', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createRequests'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Updates a change in the provided ServiceNow instance.
   *
   * @function updateRequests
   * @param {string} requestId - the id of the change to retrieve. aka sys_id
   * @param {object} body - the change data to update in ServiceNow
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  updateRequests(requestId, body, callback) {
    const meth = 'adapter-updateRequests';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (requestId === undefined || requestId === null || requestId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['requestId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [requestId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Requests', 'updateRequests', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['updateRequests'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Deletes the specified record from the specified table.
   *
   * @function deleteRequests
   * @param {string} requestId - the id of the change to retrieve. aka sys_id
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteRequests(requestId, callback) {
    const meth = 'adapter-deleteRequests';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (requestId === undefined || requestId === null || requestId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['requestId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [requestId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Requests', 'deleteRequests', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteRequests'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns the changes from the provided ServiceNow instance.
   *
   * @function getRequestItemsById
   * @param {string} itemId - the id of the change to retrieve. aka sys_id
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getRequestItemsById(itemId, callback) {
    const meth = 'adapter-getRequestItemsById';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (itemId === undefined || itemId === null || itemId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['itemId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [itemId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('RequestItems', 'getRequestItemsById', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getRequestItemsById'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns the RequestItems from the provided ServiceNow instance.
   *
   * @function getRequestItems
   * @param {object} sysparmQuery - E.g. { number: 'CHG12345' }
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getRequestItems(sysparmQuery, callback) {
    const meth = 'adapter-getRequestItems';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('RequestItems', 'getRequestItems', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getRequestItems'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Creates a change in the provided ServiceNow instance.
   *
   * @function createRequestItems
   * @param {object} body - the change data to create in ServiceNow
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createRequestItems(body, callback) {
    const meth = 'adapter-createRequestItems';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('RequestItems', 'createRequestItems', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createRequestItems'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Updates a change in the provided ServiceNow instance.
   *
   * @function updateRequestItems
   * @param {string} itemId - the id of the change to retrieve. aka sys_id
   * @param {object} body - the change data to update in ServiceNow
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  updateRequestItems(itemId, body, callback) {
    const meth = 'adapter-updateRequestItems';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (itemId === undefined || itemId === null || itemId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['itemId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [itemId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('RequestItems', 'updateRequestItems', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['updateRequestItems'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Deletes the specified record from the specified table.
   *
   * @function deleteRequestItems
   * @param {string} itemId - the id of the change to retrieve. aka sys_id
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteRequestItems(itemId, callback) {
    const meth = 'adapter-deleteRequestItems';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (itemId === undefined || itemId === null || itemId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['itemId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [itemId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('RequestItems', 'deleteRequestItems', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteRequestItems'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns the changes from the provided ServiceNow instance.
   *
   * @function getUsersById
   * @param {string} userId - the id of the change to retrieve. aka sys_id
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getUsersById(userId, callback) {
    const meth = 'adapter-getUsersById';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (userId === undefined || userId === null || userId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['userId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [userId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Users', 'getUsersById', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getUsersById'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns the Users from the provided ServiceNow instance.
   *
   * @function getUsers
   * @param {object} sysparmQuery - E.g. { name: 'username' }
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getUsers(sysparmQuery, callback) {
    const meth = 'adapter-getUsers';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = sysparmQuery;
    const pathVars = [];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Users', 'getUsers', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getUsers'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Creates a change in the provided ServiceNow instance.
   *
   * @function createUsers
   * @param {object} body - the change data to create in ServiceNow
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createUsers(body, callback) {
    const meth = 'adapter-createUsers';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Users', 'createUsers', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createUsers'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Updates a change in the provided ServiceNow instance.
   *
   * @function updateUsers
   * @param {string} userId - the id of the change to retrieve. aka sys_id
   * @param {object} body - the change data to update in ServiceNow
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  updateUsers(userId, body, callback) {
    const meth = 'adapter-updateUsers';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (userId === undefined || userId === null || userId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['userId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [userId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Users', 'updateUsers', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['updateUsers'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Deletes the specified record from the specified table.
   *
   * @function deleteUsers
   * @param {string} userId - the id of the change to retrieve. aka sys_id
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteUsers(userId, callback) {
    const meth = 'adapter-deleteUsers';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (userId === undefined || userId === null || userId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['userId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [userId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Users', 'deleteUsers', reqObj, false, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteUsers'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary This method retrieves records for communication cards. The cards include total count of each card.
   *
   * @function getMajorIncident
   * @param {string} incidentId - id of the incident.
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getMajorIncident(incidentId, callback) {
    const meth = 'adapter-getMajorIncident';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (incidentId === undefined || incidentId === null || incidentId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['incidentId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [incidentId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('MajorIncidentManagement', 'getMajorIncident', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getMajorIncident'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary This method performs UI actions and returns success status on completion of action.
   *
   * @function createMajorIncident
   * @param {string} incidentId - id of the incident.
   * @param {object} body - body param
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createMajorIncident(incidentId, body, callback) {
    const meth = 'adapter-createMajorIncident';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (incidentId === undefined || incidentId === null || incidentId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['incidentId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [incidentId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('MajorIncidentManagement', 'createMajorIncident', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createMajorIncident'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Creates a change request risk assessment.
   *
   * @function createChangeRequestRiskAssessment
   * @param {object} riskAssessment - the risk assessment to add to the change request
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createChangeRequestRiskAssessment(riskAssessment, callback) {
    const meth = 'adapter-createChangeRequestRiskAssessment';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (riskAssessment === undefined || riskAssessment === null || riskAssessment === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['riskAssessment'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = riskAssessment;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeManagement', 'createChangeRequestRiskAssessment', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createChangeRequestRiskAssessment'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary auto approve change request
   *
   * @function autoApproveChangeRequest
   * @param {string} changeId - Unique identifier of the change request to approve.
   * @param {object} approval - the approval to add to the change request
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  autoApproveChangeRequest(changeId, approval, callback) {
    const meth = 'adapter-autoApproveChangeRequest';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (changeId === undefined || changeId === null || changeId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['changeId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (approval === undefined || approval === null || approval === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['approval'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [changeId];
    const bodyVars = approval;

    // loop in template. long callback arg name to avoid identifier conflicts
    if (queryParamsAvailable && Object.keys(queryParamsAvailable).length > 0) {
      Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
        if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
            && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
          queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
        }
      });
    }

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeManagement', 'autoApproveChangeRequest', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['autoApproveChangeRequest'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }
}

module.exports = Servicenow;
