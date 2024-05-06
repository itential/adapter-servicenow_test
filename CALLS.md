## Using this Adapter

The `adapter.js` file contains the calls the adapter makes available to the rest of the Itential Platform. The API detailed for these calls should be available through JSDOC. The following is a brief summary of the calls.

### Generic Adapter Calls

These are adapter methods that IAP or you might use. There are some other methods not shown here that might be used for internal adapter functionality.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Method Signature</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Workflow?</span></th>
  </tr>
  <tr>
    <td style="padding:15px">connect()</td>
    <td style="padding:15px">This call is run when the Adapter is first loaded by he Itential Platform. It validates the properties have been provided correctly.</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">healthCheck(callback)</td>
    <td style="padding:15px">This call ensures that the adapter can communicate with Adapter for ServiceNow. The actual call that is used is defined in the adapter properties and .system entities action.json file.</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">refreshProperties(properties)</td>
    <td style="padding:15px">This call provides the adapter the ability to accept property changes without having to restart the adapter.</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">encryptProperty(property, technique, callback)</td>
    <td style="padding:15px">This call will take the provided property and technique, and return the property encrypted with the technique. This allows the property to be used in the adapterProps section for the credential password so that the password does not have to be in clear text. The adapter will decrypt the property as needed for communications with Adapter for ServiceNow.</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">iapUpdateAdapterConfiguration(configFile, changes, entity, type, action, callback)</td>
    <td style="padding:15px">This call provides the ability to update the adapter configuration from IAP - includes actions, schema, mockdata and other configurations.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapSuspendAdapter(mode, callback)</td>
    <td style="padding:15px">This call provides the ability to suspend the adapter and either have requests rejected or put into a queue to be processed after the adapter is resumed.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapUnsuspendAdapter(callback)</td>
    <td style="padding:15px">This call provides the ability to resume a suspended adapter. Any requests in queue will be processed before new requests.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapGetAdapterQueue(callback)</td>
    <td style="padding:15px">This call will return the requests that are waiting in the queue if throttling is enabled.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapFindAdapterPath(apiPath, callback)</td>
    <td style="padding:15px">This call provides the ability to see if a particular API path is supported by the adapter.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapTroubleshootAdapter(props, persistFlag, adapter, callback)</td>
    <td style="padding:15px">This call can be used to check on the performance of the adapter - it checks connectivity, healthcheck and basic get calls.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapRunAdapterHealthcheck(adapter, callback)</td>
    <td style="padding:15px">This call will return the results of a healthcheck.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapRunAdapterConnectivity(callback)</td>
    <td style="padding:15px">This call will return the results of a connectivity check.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapRunAdapterBasicGet(callback)</td>
    <td style="padding:15px">This call will return the results of running basic get API calls.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapMoveAdapterEntitiesToDB(callback)</td>
    <td style="padding:15px">This call will push the adapter configuration from the entities directory into the Adapter or IAP Database.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapDeactivateTasks(tasks, callback)</td>
    <td style="padding:15px">This call provides the ability to remove tasks from the adapter.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapActivateTasks(tasks, callback)</td>
    <td style="padding:15px">This call provides the ability to add deactivated tasks back into the adapter.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapExpandedGenericAdapterRequest(metadata, uriPath, restMethod, pathVars, queryData, requestBody, addlHeaders, callback)</td>
    <td style="padding:15px">This is an expanded Generic Call. The metadata object allows us to provide many new capabilities within the generic request.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">genericAdapterRequest(uriPath, restMethod, queryData, requestBody, addlHeaders, callback)</td>
    <td style="padding:15px">This call allows you to provide the path to have the adapter call. It is an easy way to incorporate paths that have not been built into the adapter yet.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">genericAdapterRequestNoBasePath(uriPath, restMethod, queryData, requestBody, addlHeaders, callback)</td>
    <td style="padding:15px">This call is the same as the genericAdapterRequest only it does not add a base_path or version to the call.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapRunAdapterLint(callback)</td>
    <td style="padding:15px">Runs lint on the addapter and provides the information back.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapRunAdapterTests(callback)</td>
    <td style="padding:15px">Runs baseunit and unit tests on the adapter and provides the information back.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapGetAdapterInventory(callback)</td>
    <td style="padding:15px">This call provides some inventory related information about the adapter.</td>
    <td style="padding:15px">Yes</td>
  </tr>
</table>
<br>
  
### Adapter Cache Calls

These are adapter methods that are used for adapter caching. If configured, the adapter will cache based on the interval provided. However, you can force a population of the cache manually as well.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Method Signature</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Workflow?</span></th>
  </tr>
  <tr>
    <td style="padding:15px">iapPopulateEntityCache(entityTypes, callback)</td>
    <td style="padding:15px">This call populates the adapter cache.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapRetrieveEntitiesCache(entityType, options, callback)</td>
    <td style="padding:15px">This call retrieves the specific items from the adapter cache.</td>
    <td style="padding:15px">Yes</td>
  </tr>
</table>
<br>
  
### Adapter Broker Calls

These are adapter methods that are used to integrate to IAP Brokers. This adapter currently supports the following broker calls.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Method Signature</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Workflow?</span></th>
  </tr>
  <tr>
    <td style="padding:15px">hasEntities(entityType, entityList, callback)</td>
    <td style="padding:15px">This call is utilized by the IAP Device Broker to determine if the adapter has a specific entity and item of the entity.</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevice(deviceName, callback)</td>
    <td style="padding:15px">This call returns the details of the requested device.</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevicesFiltered(options, callback)</td>
    <td style="padding:15px">This call returns the list of devices that match the criteria provided in the options filter.</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">isAlive(deviceName, callback)</td>
    <td style="padding:15px">This call returns whether the device status is active</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">getConfig(deviceName, format, callback)</td>
    <td style="padding:15px">This call returns the configuration for the selected device.</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">iapGetDeviceCount(callback)</td>
    <td style="padding:15px">This call returns the count of devices.</td>
    <td style="padding:15px">No</td>
  </tr>
</table>
<br>

### Specific Adapter Calls

Specific adapter calls are built based on the API of the Adapter for ServiceNow. The Adapter Builder creates the proper method comments for generating JS-DOC for the adapter. This is the best way to get information on the calls.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Method Signature</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Path</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Workflow?</span></th>
  </tr>
  <tr>
    <td style="padding:15px">queryTableByNameAndId(tableName, recordId, callback)</td>
    <td style="padding:15px">Retrieves the record identified by the specified sys_id from the specified table.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/{pathv1}/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">queryTableByNameWithLimit(tableName, sysparmQueryKeyValuePairs, sysparmQueryString, sysparmLimit, sysparmFields, callback)</td>
    <td style="padding:15px">Retrieves a limited number of records in the table</td>
    <td style="padding:15px">{base_path}/{version}/now/table/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createRecordInTable(tableName, body, callback)</td>
    <td style="padding:15px">Inserts one record in the specified table. Multiple record insertion is not supported by this method.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateTableRecord(tableName, recordId, body, callback)</td>
    <td style="padding:15px">Updates the specified record with the request body.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/{pathv1}/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteTableRecord(tableName, recordId, callback)</td>
    <td style="padding:15px">Deletes the specified record from the specified table.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/{pathv1}/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getAgentPresence(agentId, callback)</td>
    <td style="padding:15px">Sets the state of a provided agent’s presence and sets the agent’s channel availability for that state (if provided).</td>
    <td style="padding:15px">{base_path}/{version}/now/awa/agents/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">setAgentPresence(agentId, body, callback)</td>
    <td style="padding:15px">Sets the state of a provided agent’s presence and sets the agent’s channel availability for that state (if provided).</td>
    <td style="padding:15px">{base_path}/{version}/now/awa/agents/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getStandardChangeRequest(sysparmQuery, callback)</td>
    <td style="padding:15px">Retrieves one or more standard change requests based on the specified criteria.</td>
    <td style="padding:15px">{base_path}/{version}/sn_chg_rest/change/standard?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getStandardChangeRequestById(sysparmQuery, changeId, callback)</td>
    <td style="padding:15px">Retrieves the standard change request identified by the specified sys_id.</td>
    <td style="padding:15px">{base_path}/{version}/sn_chg_rest/change/standard/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteStandardChangeRequestById(sysparmQuery, changeId, callback)</td>
    <td style="padding:15px">Deletes the standard change request identified by the specified sys_id.</td>
    <td style="padding:15px">{base_path}/{version}/sn_chg_rest/change/standard/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getStandardChangeTemplate(sysparmQuery, callback)</td>
    <td style="padding:15px">Retrieves one or more standard change templates based on the specified criteria.</td>
    <td style="padding:15px">{base_path}/{version}/sn_chg_rest/change/standard/template?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getStandardChangeTemplateById(sysparmQuery, changeId, callback)</td>
    <td style="padding:15px">Retrieves the standard change template identified by the specified sys_id.</td>
    <td style="padding:15px">{base_path}/{version}/sn_chg_rest/change/standard/template/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">changeStandardTemplateById(standardChangeTemplateId, callback)</td>
    <td style="padding:15px">Creates one standard change request based on an existing standard change template.</td>
    <td style="padding:15px">{base_path}/{version}/sn_chg_rest/change/standard/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getNormalChangeRequest(sysparmQuery, callback)</td>
    <td style="padding:15px">Retrieves one or more normal change requests based on the specified criteria</td>
    <td style="padding:15px">{base_path}/{version}/sn_chg_rest/change/normal?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getNormalChangeRequestById(sysparmQuery, changeId, callback)</td>
    <td style="padding:15px">Retrieves the normal change request identified by the specified sys_id.</td>
    <td style="padding:15px">{base_path}/{version}/sn_chg_rest/change/normal/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createNormalChangeRequest(change, callback)</td>
    <td style="padding:15px">Creates one normal change request based on the default normal change request record.</td>
    <td style="padding:15px">{base_path}/{version}/sn_chg_rest/change/normal?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateNormalChangeRequestById(changeId, change, callback)</td>
    <td style="padding:15px">Updates one normal change request based on the default normal change request record.</td>
    <td style="padding:15px">{base_path}/{version}/sn_chg_rest/change/normal/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteNormalChangeRequestById(sysparmQuery, changeId, callback)</td>
    <td style="padding:15px">Deletes the normal change request identified by the specified sys_id.</td>
    <td style="padding:15px">{base_path}/{version}/sn_chg_rest/change/normal/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getEmergencyChangeRequest(sysparmQuery, callback)</td>
    <td style="padding:15px">Retrieves one or more emergency change requests based on the specified criteria.</td>
    <td style="padding:15px">{base_path}/{version}/sn_chg_rest/change/emergency?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getEmergencyChangeRequestById(sysparmQuery, changeId, callback)</td>
    <td style="padding:15px">Retrieves the emergency change request identified by the specified sys_id.</td>
    <td style="padding:15px">{base_path}/{version}/sn_chg_rest/change/emergency/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createEmergencyChangeRequest(sysparmQuery, callback)</td>
    <td style="padding:15px">Creates one emergency change request based on the default emergency change request record.</td>
    <td style="padding:15px">{base_path}/{version}/sn_chg_rest/change/emergency?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteEmergencyChangeRequestById(sysparmQuery, changeId, callback)</td>
    <td style="padding:15px">Deletes the emergency change request identified by the specified sys_id.</td>
    <td style="padding:15px">{base_path}/{version}/sn_chg_rest/change/emergency/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getChangeRequestTask(sysparmQuery, changeId, callback)</td>
    <td style="padding:15px">Retrieves one or more tasks associated with a specified change request based on the specified criteria.</td>
    <td style="padding:15px">{base_path}/{version}/sn_chg_rest/change/{pathv1}/task?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getChangeTaskByTaskId(sysparmQuery, changeId, taskId, callback)</td>
    <td style="padding:15px">Retrieves the task for the change request identified by the specified sys_ids.</td>
    <td style="padding:15px">{base_path}/{version}/sn_chg_rest/change/{pathv1}/task/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createChangeRequestTask(sysparmQuery, changeId, callback)</td>
    <td style="padding:15px">Creates one change request task based on the default change request task record.</td>
    <td style="padding:15px">{base_path}/{version}/sn_chg_rest/change/{pathv1}/task?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteChangeTaskByTaskId(sysparmQuery, changeId, taskId, callback)</td>
    <td style="padding:15px">Deletes the change request task identified by the specified sys_ids.</td>
    <td style="padding:15px">{base_path}/{version}/sn_chg_rest/change/{pathv1}/task/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getChangeRequestConflict(sysparmQuery, changeId, callback)</td>
    <td style="padding:15px">Retrieves the status of the currently running change request conflict checking process</td>
    <td style="padding:15px">{base_path}/{version}/sn_chg_rest/change/{pathv1}/conflict?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createChangeRequestConflict(sysparmQuery, changeId, callback)</td>
    <td style="padding:15px">Starts a change request conflict checking process for the specified change request (sys_id).</td>
    <td style="padding:15px">{base_path}/{version}/sn_chg_rest/change/{pathv1}/conflict?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">cancelChangeRequestConflict(sysparmQuery, changeId, callback)</td>
    <td style="padding:15px">Cancels the running conflict checking process for the specified change request (sys_id).</td>
    <td style="padding:15px">{base_path}/{version}/sn_chg_rest/change/{pathv1}/conflict?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getImportById(tableName, importId, callback)</td>
    <td style="padding:15px">This method retrieves the specified import staging record and resulting transformation result.</td>
    <td style="padding:15px">{base_path}/{version}/now/import/{pathv1}/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">importIntoTable(tableName, body, callback)</td>
    <td style="padding:15px">Inserts incoming data into a specified staging table.</td>
    <td style="padding:15px">{base_path}/{version}/now/import/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getApplicationById(appId, callback)</td>
    <td style="padding:15px">Retrieve a list of CIs in an application service and the relationships between them.</td>
    <td style="padding:15px">{base_path}/{version}/now/cmdb/app_service/{pathv1}/getContent?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createApplication(body, callback)</td>
    <td style="padding:15px">Create an application service or update an existing application service.</td>
    <td style="padding:15px">{base_path}/{version}/now/cmdb/app_service/create?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getEmail(emailId, callback)</td>
    <td style="padding:15px">This method returns the record details of the specified email record.</td>
    <td style="padding:15px">{base_path}/{version}/now/email/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createEmail(body, callback)</td>
    <td style="padding:15px">This method creates the email record specified in the request body.</td>
    <td style="padding:15px">{base_path}/{version}/now/email?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">pushInstallation(pushApplicationName, body, callback)</td>
    <td style="padding:15px">Adds or updates tokens that enable devices to receive push notifications from the specified application.</td>
    <td style="padding:15px">{base_path}/{version}/now/push/{pathv1}/removeInstallation?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">removeInstallation(pushApplicationName, body, callback)</td>
    <td style="padding:15px">Adds or updates tokens that enable devices to receive push notifications from the specified application.</td>
    <td style="padding:15px">{base_path}/{version}/now/push/{pathv1}/installation?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getMetricBase(table, subject, metric, sysparmEnd, sysparmStart, callback)</td>
    <td style="padding:15px">Retrieve time series data from the MetricBase database.</td>
    <td style="padding:15px">{base_path}/{version}/now/v1/clotho/table/{pathv1}/{pathv2}/{pathv3}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createMetricBase(body, callback)</td>
    <td style="padding:15px">Adds time-series data to the MetricBase database.</td>
    <td style="padding:15px">{base_path}/{version}/now/v1/clotho/put?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">transformMetricBase(table, metric, sysparmEnd, sysparmStart, callback)</td>
    <td style="padding:15px">Transforms selected data.</td>
    <td style="padding:15px">{base_path}/{version}/now/v1/clotho/transform/{pathv1}/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getAggregate(sysparmQuery, tableName, aggregate, callback)</td>
    <td style="padding:15px">This method retrieves records for the specified table and performs aggregate functions on the returned values.</td>
    <td style="padding:15px">{base_path}/{version}/now/stats/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createQueue(queueId, body, callback)</td>
    <td style="padding:15px">If an active work item exists, routes a document to a queue.</td>
    <td style="padding:15px">{base_path}/{version}/now/awa/queues/{pathv1}/work_item?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getUserRoles(userId, callback)</td>
    <td style="padding:15px">Returns a specified user's granted and inherited roles.</td>
    <td style="padding:15px">{base_path}/{version}/global/user_role_inheritance?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getPerformanceAnalytics(sysparmUuid, callback)</td>
    <td style="padding:15px">This method retrieves details about indicators from the Analytics Hub.</td>
    <td style="padding:15px">{base_path}/{version}/now/pa/scorecards?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getChannelsForTable(sysparmTable, callback)</td>
    <td style="padding:15px">This method returns the list of channels for a given task record.</td>
    <td style="padding:15px">{base_path}/{version}/sn_comm_management/task_communication_management/channels?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getChannelsForTableByTaskId(commTaskId, table, callback)</td>
    <td style="padding:15px">This method returns meta data of all channels associated with a given communication task id and table.</td>
    <td style="padding:15px">{base_path}/{version}/sn_comm_management/task_communication_management/channels_per_task/{pathv1}/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getCommunicationGroupPlans(taskId, callback)</td>
    <td style="padding:15px">This method returns list of communication plans that includes communication tasks and channels.</td>
    <td style="padding:15px">{base_path}/{version}/sn_comm_management/task_communication_management/communication_detail/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getCommunicationPlans(taskId, callback)</td>
    <td style="padding:15px">This method returns list of communication plans that includes communication tasks and channels.</td>
    <td style="padding:15px">{base_path}/{version}/sn_comm_management/task_communication_management/groups/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">manageCommunicationRecipients(sysparmTable, commPlanId, body, callback)</td>
    <td style="padding:15px">This method manages the recipients of a communication plan.</td>
    <td style="padding:15px">{base_path}/{version}/sn_comm_management/task_communication_management/comm_plan/{pathv1}/recipients?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createCommunicationPlan(sysparmTable, body, callback)</td>
    <td style="padding:15px">Create a communication plan and communication task instance</td>
    <td style="padding:15px">{base_path}/{version}/sn_comm_management/task_communication_management/adhoc/comm_plan?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getCommunicationTaskState(commTaskId, table, body, callback)</td>
    <td style="padding:15px">This method returns success status if the channel task is successfully completed.</td>
    <td style="padding:15px">{base_path}/{version}/sn_comm_management/task_communication_management/send_updates/{pathv1}/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createCommunicationTask(sysparmTable, body, callback)</td>
    <td style="padding:15px">This method is used to create a communication task instance.</td>
    <td style="padding:15px">{base_path}/{version}/sn_comm_management/task_communication_management/adhoc/comm_task?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateCommunicationTask(commTaskId, table, body, callback)</td>
    <td style="padding:15px">This method performs specified action on communication tasks.</td>
    <td style="padding:15px">{base_path}/{version}/sn_comm_management/task_communication_management/update_state_wb_actions/{pathv1}/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getAttachmentMetadataById(attachId, callback)</td>
    <td style="padding:15px">This method gets the metadata for the attachment file with a specific sys_id value.</td>
    <td style="padding:15px">{base_path}/{version}/now/attachment/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getAttachmentBinaryById(attachId, callback)</td>
    <td style="padding:15px">This method gets the binary file attachment with a specific sys_id value.</td>
    <td style="padding:15px">{base_path}/{version}/now/attachment/{pathv1}/file?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getAttachmentsMetadata(sysparmQuery, callback)</td>
    <td style="padding:15px">This method gets the metadata for multiple attachments.</td>
    <td style="padding:15px">{base_path}/{version}/now/attachment?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">uploadAttachment(encryptionContext, fileName, tableName, tableId, bodyFormData, callback)</td>
    <td style="padding:15px">This method uploads a binary file specified in the request body as an attachment.</td>
    <td style="padding:15px">{base_path}/{version}/now/attachment/file?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">uploadMultipartAttachment(bodyFormData, callback)</td>
    <td style="padding:15px">This method uploads a multipart file attachment.</td>
    <td style="padding:15px">{base_path}/{version}/now/attachment/upload?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteAttachmentById(attachId, callback)</td>
    <td style="padding:15px">This method deletes the attachment with a specific sys_id value.</td>
    <td style="padding:15px">{base_path}/{version}/now/attachment/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getCSMAccount(id, callback)</td>
    <td style="padding:15px">Retrieves the specified CSM account.</td>
    <td style="padding:15px">{base_path}/{version}/now/account/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">queryCSMAccounts(sysparmQuery, callback)</td>
    <td style="padding:15px">Retrieves a specified set of CSM accounts.</td>
    <td style="padding:15px">{base_path}/{version}/now/account?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getCSMCase(id, callback)</td>
    <td style="padding:15px">Retrieves the specified CSM case.</td>
    <td style="padding:15px">{base_path}/{version}/sn_customerservice/case/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">queryCSMCases(sysparmQuery, callback)</td>
    <td style="padding:15px">Retrieves a specified set of CSM cases.</td>
    <td style="padding:15px">{base_path}/{version}/sn_customerservice/case?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createCSMCase(sysparmQuery, body, callback)</td>
    <td style="padding:15px">Creates a new CSM case.</td>
    <td style="padding:15px">{base_path}/{version}/sn_customerservice/case?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateCSMCase(id, body, callback)</td>
    <td style="padding:15px">Updates the specified existing CSM case with the passed-in parameters.</td>
    <td style="padding:15px">{base_path}/{version}/sn_customerservice/case/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getCSMConsumer(id, callback)</td>
    <td style="padding:15px">Retrieves the specified CSM consumer record.</td>
    <td style="padding:15px">{base_path}/{version}/now/consumer/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">queryCSMConsumers(sysparmQuery, callback)</td>
    <td style="padding:15px">Retrieves a specified set of CSM consumer records.</td>
    <td style="padding:15px">{base_path}/{version}/now/consumer?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createCSMConsumer(sysparmQuery, body, callback)</td>
    <td style="padding:15px">Creates a new CSM consumer.</td>
    <td style="padding:15px">{base_path}/{version}/now/consumer?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getCSMContact(id, callback)</td>
    <td style="padding:15px">Retrieves the specified CSM contact.</td>
    <td style="padding:15px">{base_path}/{version}/now/contact/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">queryCSMContacts(sysparmQuery, callback)</td>
    <td style="padding:15px">Retrieves a specified set of CSM contacts.</td>
    <td style="padding:15px">{base_path}/{version}/now/contact?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createCSMContact(sysparmQuery, body, callback)</td>
    <td style="padding:15px">Creates a new CSM contact.</td>
    <td style="padding:15px">{base_path}/{version}/now/contact?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getServiceCatalogs(sysparmLimit, callback)</td>
    <td style="padding:15px">Retrieves a list of catalogs to which the user has access based on the passed in parameters.</td>
    <td style="padding:15px">{base_path}/{version}/sn_sc/servicecatalog/catalogs?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getServiceCatalogById(sysparmLimit, catalogId, callback)</td>
    <td style="padding:15px">Retrieves the available information for a specified catalog.</td>
    <td style="padding:15px">{base_path}/{version}/sn_sc/servicecatalog/catalogs/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getServiceCatalogCategoryInformation(sysparmLimit, catalogId, callback)</td>
    <td style="padding:15px">Retrieves the available information for a specified category.</td>
    <td style="padding:15px">{base_path}/{version}/sn_sc/servicecatalog/catalogs/{pathv1}/categories?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getServiceCatalogCategories(sysparmLimit, catalogId, callback)</td>
    <td style="padding:15px">Retrieves the list of available categories for the specified catalog.</td>
    <td style="padding:15px">{base_path}/{version}/sn_sc/servicecatalog/categories/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getServiceCatalogItems(sysparmLimit, sysparmCatalog, sysparmCategory, callback)</td>
    <td style="padding:15px">Retrieves a list of catalog items based on the specified parameters.</td>
    <td style="padding:15px">{base_path}/{version}/sn_sc/servicecatalog/items?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getServiceCatalogItemById(sysparmLimit, catalogId, callback)</td>
    <td style="padding:15px">Retrieves a specified catalog item.</td>
    <td style="padding:15px">{base_path}/{version}/sn_sc/servicecatalog/items/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">addItemToCart(itemId, body, callback)</td>
    <td style="padding:15px">Adds the specified item to the cart of the current user.</td>
    <td style="padding:15px">{base_path}/{version}/sn_sc/servicecatalog/items/{pathv1}/add_to_cart?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getServiceCatalogOrderItems(itemId, body, callback)</td>
    <td style="padding:15px">Retrieves a list of items based on the needs described for an order guide.</td>
    <td style="padding:15px">{base_path}/{version}/sn_sc/servicecatalog/items/{pathv1}/submit_producer?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createServiceCatalogRecordGuide(itemId, body, callback)</td>
    <td style="padding:15px">Creates a record and returns the Table API relative path and redirect URL to access the created record.</td>
    <td style="padding:15px">{base_path}/{version}/sn_sc/servicecatalog/items/{pathv1}/submit_guide?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getServiceCatalogCheckoutInformation(itemId, body, callback)</td>
    <td style="padding:15px">Retrieves an array of contents requested for checkout.</td>
    <td style="padding:15px">{base_path}/{version}/sn_sc/servicecatalog/items/{pathv1}/checkout_guide?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">orderNowServiceCatalog(itemId, body, callback)</td>
    <td style="padding:15px">Orders the specified catalog item.</td>
    <td style="padding:15px">{base_path}/{version}/sn_sc/servicecatalog/items/{pathv1}/order_now?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getServiceCatalogCart(callback)</td>
    <td style="padding:15px">Retrieves the details of the items within the logged in user's cart.</td>
    <td style="padding:15px">{base_path}/{version}/sn_sc/servicecatalog/cart?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getServiceCatalogUserDeliveryAddress(userId, callback)</td>
    <td style="padding:15px">Retrieves the shipping address of the specified user.</td>
    <td style="padding:15px">{base_path}/{version}/sn_sc/servicecatalog/cart/delivery_address/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateServiceCatalogCart(cartItemId, bodyFormData, callback)</td>
    <td style="padding:15px">Updates the specified item in the logged in user's cart.</td>
    <td style="padding:15px">{base_path}/{version}/sn_sc/servicecatalog/cart/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteServiceCatalogCartItems(cartItemId, callback)</td>
    <td style="padding:15px">Deletes the specified item from the current cart.</td>
    <td style="padding:15px">{base_path}/{version}/sn_sc/servicecatalog/cart/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getServiceCatalogDisplayVariable(itemId, body, callback)</td>
    <td style="padding:15px">Returns the display value of the specified variable.</td>
    <td style="padding:15px">{base_path}/{version}/sn_sc/servicecatalog/variables/{pathv1}/display_value?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteServiceCatalogCart(cartId, callback)</td>
    <td style="padding:15px">Deletes a specified cart, and the contents of the cart.</td>
    <td style="padding:15px">{base_path}/{version}/sn_sc/servicecatalog/cart/{pathv1}/empty?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">checkoutCartServiceCatalog(callback)</td>
    <td style="padding:15px">Retrieves and processes the checkout for the current cart based on whether the two-step checkout process is enabled.</td>
    <td style="padding:15px">{base_path}/{version}/sn_sc/servicecatalog/cart/checkout?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">submitOrderServiceCatalog(callback)</td>
    <td style="padding:15px">Checks out the user cart, based on the current check-out type (one-step or two-step ).</td>
    <td style="padding:15px">{base_path}/{version}/sn_sc/servicecatalog/cart/submit_order?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getChangeRequests(sysparmQuery, callback)</td>
    <td style="padding:15px">Returns the changes from the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/change_request?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getChangeRequestById(changeId, callback)</td>
    <td style="padding:15px">Returns the changes from the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/change_request/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createChangeRequest(body, callback)</td>
    <td style="padding:15px">Creates a change in the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/change_request?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateChangeRequest(changeId, body, callback)</td>
    <td style="padding:15px">Updates a change in the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/change_request/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteChangeRequest(changeId, callback)</td>
    <td style="padding:15px">Deletes the specified record from the specified table.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/change_request/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getIncidentById(incidentId, callback)</td>
    <td style="padding:15px">Returns the changes from the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/incident/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getIncidents(sysparmQuery, callback)</td>
    <td style="padding:15px">Returns the Incident from the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/incident?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createIncident(body, callback)</td>
    <td style="padding:15px">Creates a change in the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/incident?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateIncident(incidentId, body, callback)</td>
    <td style="padding:15px">Updates a change in the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/incident/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteIncident(incidentId, callback)</td>
    <td style="padding:15px">Deletes the specified record from the specified table.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/incident/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getGroupById(groupId, callback)</td>
    <td style="padding:15px">Returns the changes from the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/sys_user_group/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getGroups(sysparmQuery, callback)</td>
    <td style="padding:15px">Returns the group from the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/sys_user_group?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createGroup(body, callback)</td>
    <td style="padding:15px">Creates a change in the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/sys_user_group?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateGroup(groupId, body, callback)</td>
    <td style="padding:15px">Updates a change in the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/sys_user_group/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteGroup(groupId, callback)</td>
    <td style="padding:15px">Deletes the specified record from the specified table.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/sys_user_group/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getConfigItemById(itemId, callback)</td>
    <td style="padding:15px">Returns the changes from the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/cmdb_ci/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getConfigItems(sysparmQuery, callback)</td>
    <td style="padding:15px">Returns the ConfigItem from the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/cmdb_ci?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createConfigItem(body, callback)</td>
    <td style="padding:15px">Creates a change in the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/cmdb_ci?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateConfigItem(itemId, body, callback)</td>
    <td style="padding:15px">Updates a change in the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/cmdb_ci/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteConfigItem(itemId, callback)</td>
    <td style="padding:15px">Deletes the specified record from the specified table.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/cmdb_ci/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getArticleById(articleId, callback)</td>
    <td style="padding:15px">Returns the changes from the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/kb_knowledge/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getArticles(sysparmQuery, callback)</td>
    <td style="padding:15px">Returns the Article from the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/kb_knowledge?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createArticle(body, callback)</td>
    <td style="padding:15px">Creates a change in the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/kb_knowledge?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateArticle(articleId, body, callback)</td>
    <td style="padding:15px">Updates a change in the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/kb_knowledge/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteArticle(articleId, callback)</td>
    <td style="padding:15px">Deletes the specified record from the specified table.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/kb_knowledge/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getProblemById(problemId, callback)</td>
    <td style="padding:15px">Returns the changes from the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/problem/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getProblems(sysparmQuery, callback)</td>
    <td style="padding:15px">Returns the Problem from the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/problem?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createProblem(body, callback)</td>
    <td style="padding:15px">Creates a change in the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/problem?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateProblem(problemId, body, callback)</td>
    <td style="padding:15px">Updates a change in the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/problem/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteProblem(problemId, callback)</td>
    <td style="padding:15px">Deletes the specified record from the specified table.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/problem/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getRequestsById(requestId, callback)</td>
    <td style="padding:15px">Returns the changes from the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/sc_request/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getRequests(sysparmQuery, callback)</td>
    <td style="padding:15px">Returns the Requests from the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/sc_request?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createRequests(body, callback)</td>
    <td style="padding:15px">Creates a change in the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/sc_request?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateRequests(requestId, body, callback)</td>
    <td style="padding:15px">Updates a change in the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/sc_request/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteRequests(requestId, callback)</td>
    <td style="padding:15px">Deletes the specified record from the specified table.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/sc_request/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getRequestItemsById(itemId, callback)</td>
    <td style="padding:15px">Returns the changes from the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/sc_req_item/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getRequestItems(sysparmQuery, callback)</td>
    <td style="padding:15px">Returns the RequestItems from the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/sc_req_item?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createRequestItems(body, callback)</td>
    <td style="padding:15px">Creates a change in the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/sc_req_item?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateRequestItems(itemId, body, callback)</td>
    <td style="padding:15px">Updates a change in the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/sc_req_item/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteRequestItems(itemId, callback)</td>
    <td style="padding:15px">Deletes the specified record from the specified table.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/sc_req_item/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getUsersById(userId, callback)</td>
    <td style="padding:15px">Returns the changes from the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/sys_user/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getUsers(sysparmQuery, callback)</td>
    <td style="padding:15px">Returns the Users from the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/sys_user?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createUsers(body, callback)</td>
    <td style="padding:15px">Creates a change in the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/sys_user?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateUsers(userId, body, callback)</td>
    <td style="padding:15px">Updates a change in the provided ServiceNow instance.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/sys_user/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteUsers(userId, callback)</td>
    <td style="padding:15px">Deletes the specified record from the specified table.</td>
    <td style="padding:15px">{base_path}/{version}/now/table/sys_user/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getMajorIncident(incidentId, callback)</td>
    <td style="padding:15px">This method retrieves records for communication cards. The cards include total count of each card.</td>
    <td style="padding:15px">{base_path}/{version}/sn_major_inc_mgmt/mim/status/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createMajorIncident(incidentId, body, callback)</td>
    <td style="padding:15px">This method performs UI actions and returns success status on completion of action.</td>
    <td style="padding:15px">{base_path}/{version}/sn_major_inc_mgmt/mim/state/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createChangeRequestRiskAssessment(riskAssessment, callback)</td>
    <td style="padding:15px">Creates a change request risk assessment</td>
    <td style="padding:15px">{base_path}/{version}/sn_chg_rest/change/risk_copy_asmt?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">autoApproveChangeRequest(changeId, approval, callback)</td>
    <td style="padding:15px">auto approve change request</td>
    <td style="padding:15px">{base_path}/{version}/sn_chg_rest/change/{pathv1}/approvals?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
</table>
<br>
