# Adapter for ServiceNow

## Table of Contents 

  - [Getting Started](#getting-started)
    - [Helpful Background Information](#helpful-background-information)
    - [Prerequisites](#prerequisites)
    - [How to Install](#how-to-install)
    - [Testing](#testing)
  - [Configuration](#configuration)
    - [Example Properties](#example-properties)
    - [Connection Properties](#connection-properties)
    - [Authentication Properties](#authentication-properties)
    - [Healthcheck Properties](#healthcheck-properties)
    - [Request Properties](#request-properties)
    - [SSL Properties](#ssl-properties)
    - [Throttle Properties](#throttle-properties)
    - [Proxy Properties](#proxy-properties)
    - [Mongo Properties](#mongo-properties)
    - [Device Broker Properties](#device-broker-properties)
  - [Using this Adapter](#using-this-adapter)
    - [Generic Adapter Calls](#generic-adapter-calls)
    - [Adapter Cache Calls](#adapter-cache-calls)
    - [Adapter Broker Calls](#adapter-broker-calls)
    - [Specific Adapter Calls](#specific-adapter-calls)
    - [Authentication](#authentication)
  - [Additional Information](#additional-information)
    - [Enhancements](#enhancements)
    - [Contributing](#contributing)
    - [Helpful Links](#helpful-links)
    - [Node Scripts](#node-scripts)
  - [Troubleshoot](#troubleshoot)
    - [Connectivity Issues](#connectivity-issues)
    - [Functional Issues](#functional-issues)

## Getting Started

These instructions will help you get a copy of the project on your local machine for development and testing. Reading this section is also helpful for deployments as it provides you with pertinent information on prerequisites and properties.

### Helpful Background Information

There is <a href="https://docs.itential.com/opensource/docs/adapters" target="_blank">Adapter documentation available on the Itential Documentation Site</a>. This documentation includes information and examples that are helpful for:

```text
Authentication
IAP Service Instance Configuration
Code Files
Endpoint Configuration (Action & Schema)
Mock Data
Adapter Generic Methods
Headers
Security
Linting and Testing
Build an Adapter
Troubleshooting an Adapter
```

Others will be added over time.
Want to build a new adapter? Use the <a href="https://adapters.itential.io" target="_blank">Itential Adapter Builder</a>

### Prerequisites

The following is a list of required packages for installation on the system the adapter will run on:

```text
Node.js
npm
Git
```

The following list of packages are required for Itential opensource adapters or custom adapters that have been built utilizing the Itential Adapter Builder. You can install these packages by running npm install inside the adapter directory.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Package</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
  </tr>
  <tr>
    <td style="padding:15px">@itentialopensource/adapter-utils</td>
    <td style="padding:15px">Runtime library classes for all adapters;  includes request handling, connection, authentication throttling, and translation.</td>
  </tr>
  <tr>
    <td style="padding:15px">ajv</td>
    <td style="padding:15px">Required for validation of adapter properties to integrate with Servicenow.</td>
  </tr>
  <tr>
    <td style="padding:15px">axios</td>
    <td style="padding:15px">Utilized by the node scripts that are included with the adapter; helps to build and extend the functionality.</td>
  </tr>
  <tr>
    <td style="padding:15px">commander</td>
    <td style="padding:15px">Utilized by the node scripts that are included with the adapter; helps to build and extend the functionality.</td>
  </tr>
  <tr>
    <td style="padding:15px">dns-lookup-promise</td>
    <td style="padding:15px">Utilized by the node scripts that are included with the adapter; helps to build and extend the functionality.</td>
  </tr>
  <tr>
    <td style="padding:15px">fs-extra</td>
    <td style="padding:15px">Utilized by the node scripts that are included with the adapter; helps to build and extend the functionality.</td>
  </tr>
  <tr>
    <td style="padding:15px">mocha</td>
    <td style="padding:15px">Testing library that is utilized by some of the node scripts that are included with the adapter.</td>
  </tr>
  <tr>
    <td style="padding:15px">mocha-param</td>
    <td style="padding:15px">Testing library that is utilized by some of the node scripts that are included with the adapter.</td>
  </tr>
  <tr>
    <td style="padding:15px">mongodb</td>
    <td style="padding:15px">Utilized by the node scripts that are included with the adapter; helps to build and extend the functionality.</td>
  </tr>
  <tr>
    <td style="padding:15px">nyc</td>
    <td style="padding:15px">Testing coverage library that is utilized by some of the node scripts that are included with the adapter.</td>
  </tr>
  <tr>
    <td style="padding:15px">ping</td>
    <td style="padding:15px">Utilized by the node scripts that are included with the adapter; helps to build and extend the functionality.</td>
  </tr>
  <tr>
    <td style="padding:15px">readline-sync</td>
    <td style="padding:15px">Utilized by the node script that comes with the adapter;  helps to test unit and integration functionality.</td>
  </tr>
  <tr>
    <td style="padding:15px">semver</td>
    <td style="padding:15px">Utilized by the node scripts that are included with the adapter; helps to build and extend the functionality.</td>
  </tr>
  <tr>
    <td style="padding:15px">winston</td>
    <td style="padding:15px">Utilized by the node scripts that are included with the adapter; helps to build and extend the functionality.</td>
  </tr>
</table>
<br>

If you are developing and testing a custom adapter, or have testing capabilities on an Itential opensource adapter, you will need to install these packages as well.

```text
chai
eslint
eslint-config-airbnb-base
eslint-plugin-import
eslint-plugin-json
testdouble
```

### How to Install

Installing an Adapter into your instance of Itential varies for Itential Cloud and On Prem IAP customers.

#### Cloud
1. Create an instance of the adapter in IAP Admin Essentials GUI

2. Change the adapter service instance configuration (host, port, credentials, etc) in IAP Admin Essentials GUI

#### On Prem IAP
1. Set up the name space location in your IAP node_modules.

```bash
cd /opt/pronghorn/current/node_modules (* could be in a different place)
if the @itentialopensource directory does not exist, create it:
    mkdir @itentialopensource
```

2. Clone/unzip/tar the adapter into your IAP environment.

```bash
cd \@itentialopensource
git clone git@gitlab.com:\@itentialopensource/adapters/adapter-servicenow
or
unzip adapter-servicenow.zip
or
tar -xvf adapter-servicenow.tar
```

3. Run the adapter install script.

```bash
cd adapter-servicenow
npm install
npm run lint:errors
npm run test
```

4. Restart IAP

```bash
systemctl restart pronghorn
```

5. Create an adapter service instance configuration in IAP Admin Essentials GUI

6. Copy the properties from the sampleProperties.json and paste them into the service instance configuration in the inner/second properties field.

7. Change the adapter service instance configuration (host, port, credentials, etc) in IAP Admin Essentials GUI


For an easier install of the adapter use npm run adapter:install, it will install the adapter in IAP. Please note that it can be dependent on where the adapter is installed and on the version of IAP so it is subject to fail. If using this, you can replace step 3-5 above with these:

3. Install adapter dependencies and check the adapter.

```bash
cd adapter-servicenow
npm run adapter:install
```

4. Restart IAP

```bash
systemctl restart pronghorn
```

5. Change the adapter service instance configuration (host, port, credentials, etc) in IAP Admin Essentials GUI


### Testing

Mocha is generally used to test all Itential Opensource Adapters. There are unit tests as well as integration tests performed. Integration tests can generally be run as standalone using mock data and running the adapter in stub mode, or as integrated. When running integrated, every effort is made to prevent environmental failures, however there is still a possibility.

#### Unit Testing

Unit Testing includes testing basic adapter functionality as well as error conditions that are triggered in the adapter prior to any integration. There are two ways to run unit tests. The prefered method is to use the testRunner script; however, both methods are provided here.

```bash
node utils/testRunner --unit

npm run test:unit
npm run test:baseunit
```

To add new unit tests, edit the `test/unit/adapterTestUnit.js` file. The tests that are already in this file should provide guidance for adding additional tests.

#### Integration Testing - Standalone

Standalone Integration Testing requires mock data to be provided with the entities. If this data is not provided, standalone integration testing will fail. When the adapter is set to run in stub mode (setting the stub property to true), the adapter will run through its code up to the point of making the request. It will then retrieve the mock data and return that as if it had received that data as the response from Servicenow. It will then translate the data so that the adapter can return the expected response to the rest of the Itential software. Standalone is the default integration test.

Similar to unit testing, there are two ways to run integration tests. Using the testRunner script is better because it prevents you from having to edit the test script; it will also resets information after testing is complete so that credentials are not saved in the file.

```bash
node utils/testRunner
  answer no at the first prompt

npm run test:integration
```

To add new integration tests, edit the `test/integration/adapterTestIntegration.js` file. The tests that are already in this file should provide guidance for adding additional tests.

#### Integration Testing

Integration Testing requires connectivity to Servicenow. By using the testRunner script it prevents you from having to edit the integration test. It also resets the integration test after the test is complete so that credentials are not saved in the file.

> **Note**: These tests have been written as a best effort to make them work in most environments. However, the Adapter Builder often does not have the necessary information that is required to set up valid integration tests. For example, the order of the requests can be very important and data is often required for `creates` and `updates`. Hence, integration tests may have to be enhanced before they will work (integrate) with Servicenow. Even after tests have been set up properly, it is possible there are environmental constraints that could result in test failures. Some examples of possible environmental issues are customizations that have been made within Servicenow which change order dependencies or required data.

```bash
node utils/testRunner
answer yes at the first prompt
answer all other questions on connectivity and credentials
```

Test should also be written to clean up after themselves. However, it is important to understand that in some cases this may not be possible. In addition, whenever exceptions occur, test execution may be stopped, which will prevent cleanup actions from running. It is recommended that tests be utilized in dev and test labs only.

> **Reminder**: Do not check in code with actual credentials to systems.

## Configuration

This section defines **all** the properties that are available for the adapter, including detailed information on what each property is for. If you are not using certain capabilities with this adapter, you do not need to define all of the properties. An example of how the properties for this adapter can be used with tests or IAP are provided in the sampleProperties.

### Example Properties

```json
  "properties": {
    "host": "localhost",
    "port": 443,
    "choosepath": "",
    "base_path": "/api",
    "version": "",
    "cache_location": "none",
    "encode_pathvars": true,
    "encode_queryvars": true,
    "save_metric": false,
    "stub": true,
    "protocol": "https",
    "authentication": {
      "auth_method": "basic user_password",
      "username": "username",
      "password": "password",
      "token": "",
      "token_timeout": 180000,
      "token_cache": "local",
      "invalid_token_error": 401,
      "auth_field": "header.headers.Authorization",
      "auth_field_format": "Basic {b64}{username}:{password}{/b64}",
      "auth_logging": false,
      "client_id": "",
      "client_secret": "",
      "grant_type": "",
      "sensitive": [],
      "sso": {
        "protocol": "",
        "host": "",
        "port": 0
      },
      "multiStepAuthCalls": [
        {
          "name": "",
          "requestFields": {},
          "responseFields": {},
          "successfullResponseCode": 200
        }
      ]
    },
    "healthcheck": {
      "type": "startup",
      "frequency": 300000,
      "query_object": {},
      "addlHeaders": {}
    },
    "throttle": {
      "throttle_enabled": false,
      "number_pronghorns": 1,
      "sync_async": "sync",
      "max_in_queue": 1000,
      "concurrent_max": 1,
      "expire_timeout": 0,
      "avg_runtime": 200,
      "priorities": [
        {
          "value": 0,
          "percent": 100
        }
      ]
    },
    "request": {
      "number_redirects": 0,
      "number_retries": 3,
      "limit_retry_error": 401,
      "failover_codes": [
        404,
        405
      ],
      "attempt_timeout": 5000,
      "global_request": {
        "payload": {},
        "uriOptions": {},
        "addlHeaders": {},
        "authData": {}
      },
      "healthcheck_on_timeout": false,
      "return_raw": false,
      "archiving": false,
      "return_request": false
    },
    "proxy": {
      "enabled": false,
      "host": "",
      "port": 1,
      "protocol": "http",
      "username": "",
      "password": ""
    },
    "ssl": {
      "ecdhCurve": "",
      "enabled": true,
      "accept_invalid_cert": true,
      "ca_file": "",
      "key_file": "",
      "cert_file": "",
      "secure_protocol": "",
      "ciphers": ""
    },
    "mongo": {
      "host": "",
      "port": 0,
      "database": "",
      "username": "",
      "password": "",
      "replSet": "",
      "db_ssl": {
        "enabled": false,
        "accept_invalid_cert": false,
        "ca_file": "",
        "key_file": "",
        "cert_file": ""
      }
    },
    "devicebroker": {
      "getDevice": [
        {
          "path": "/get/devices/{id}",
          "method": "GET",
          "query": {},
          "body": {},
          "headers": {},
          "handleFailure": "ignore",
          "requestFields": {
            "id": "name"
          },
          "responseDatakey": "",
          "responseFields": {
            "name": "host",
            "ostype": "os",
            "ostypePrefix": "system-",
            "ipaddress": "attributes.ipaddr",
            "port": "443"
          }
        }
      ],
      "getDevicesFiltered": [
        {
          "path": "/get/devices",
          "method": "GET",
          "pagination": {
            "offsetVar": "",
            "limitVar": "",
            "incrementBy": "limit",
            "requestLocation": "query"
          },
          "query": {},
          "body": {},
          "headers": {},
          "handleFailure": "ignore",
          "requestFields": {},
          "responseDatakey": "",
          "responseFields": {
            "name": "host",
            "ostype": "os",
            "ostypePrefix": "system-",
            "ipaddress": "attributes.ipaddr",
            "port": "443"
          }
        }
      ],
      "isAlive": [
        {
          "path": "/get/devices/{id}/status",
          "method": "GET",
          "query": {},
          "body": {},
          "headers": {},
          "handleFailure": "ignore",
          "requestFields": {
            "id": "name"
          },
          "responseDatakey": "",
          "responseFields": {
            "status": "status",
            "statusValue": "online"
          }
        }
      ],
      "getConfig": [
        {
          "path": "/get/devices/{id}/configPart1",
          "method": "GET",
          "query": {},
          "body": {},
          "headers": {},
          "handleFailure": "ignore",
          "requestFields": {
            "id": "name"
          },
          "responseDatakey": "",
          "responseFields": {}
        }
      ],
      "getCount": [
        {
          "path": "/get/devices",
          "method": "GET",
          "query": {},
          "body": {},
          "headers": {},
          "handleFailure": "ignore",
          "requestFields": {},
          "responseDatakey": "",
          "responseFields": {}
        }
      ]
    },
    "cache": {
      "enabled": false,
      "entities": [
        {
          "entityType": "",
          "frequency": 1440,
          "flushOnFail": false,
          "limit": 1000,
          "retryAttempts": 5,
          "sort": true,
          "populate": [
            {
              "path": "",
              "method": "GET",
              "pagination": {
                "offsetVar": "",
                "limitVar": "",
                "incrementBy": "limit",
                "requestLocation": "query"
              },
              "query": {},
              "body": {},
              "headers": {},
              "handleFailure": "ignore",
              "requestFields": {},
              "responseDatakey": "",
              "responseFields": {}
            }
          ],
          "cachedTasks": [
            {
              "name": "",
              "filterField": "",
              "filterLoc": ""
            }
          ]
        }
      ]
    }
  }
```

### Connection Properties

These base properties are used to connect to Servicenow upon the adapter initially coming up. It is important to set these properties appropriately.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Property</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
  </tr>
  <tr>
    <td style="padding:15px">host</td>
    <td style="padding:15px">Required. A fully qualified domain name or IP address.</td>
  </tr>
  <tr>
    <td style="padding:15px">port</td>
    <td style="padding:15px">Required. Used to connect to the server.</td>
  </tr>
  <tr>
    <td style="padding:15px">base_path</td>
    <td style="padding:15px">Optional. Used to define part of a path that is consistent for all or most endpoints. It makes the URIs easier to use and maintain but can be overridden on individual calls. An example **base_path** might be `/rest/api`. Default is ``.</td>
  </tr>
  <tr>
    <td style="padding:15px">version</td>
    <td style="padding:15px">Optional. Used to set a global version for action endpoints. This makes it faster to update the adapter when endpoints change. As with the base-path, version can be overridden on individual endpoints. Default is ``.</td>
  </tr>
  <tr>
    <td style="padding:15px">cache_location</td>
    <td style="padding:15px">Optional. Used to define where the adapter cache is located. The cache is used to maintain an entity list to improve performance. Storage locally is lost when the adapter is restarted. Storage in Redis is preserved upon adapter restart. Default is none which means no caching of the entity list.</td>
  </tr>
  <tr>
    <td style="padding:15px">encode_pathvars</td>
    <td style="padding:15px">Optional. Used to tell the adapter to encode path variables or not. The default behavior is to encode them so this property can be used to stop that behavior.</td>
  </tr>
  <tr>
    <td style="padding:15px">encode_queryvars</td>
    <td style="padding:15px">Optional. Used to tell the adapter to encode query parameters or not. The default behavior is to encode them so this property can be used to stop that behavior.</td>
  </tr>
  <tr>
    <td style="padding:15px">save_metric</td>
    <td style="padding:15px">Optional. Used to tell the adapter to save metric information (this does not impact metrics returned on calls). This allows the adapter to gather metrics over time. Metric data can be stored in a database or on the file system.</td>
  </tr>
  <tr>
    <td style="padding:15px">stub</td>
    <td style="padding:15px">Optional. Indicates whether the stub should run instead of making calls to Servicenow (very useful during basic testing). Default is false (which means connect to Servicenow).</td>
  </tr>
  <tr>
    <td style="padding:15px">protocol</td>
    <td style="padding:15px">Optional. Notifies the adapter whether to use HTTP or HTTPS. Default is HTTP.</td>
  </tr>
</table>
<br>

A connectivity check tells IAP the adapter has loaded successfully.

### Authentication Properties

The following properties are used to define the authentication process to Servicenow.

>**Note**: Depending on the method that is used to authenticate with Servicenow, you may not need to set all of the authentication properties.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Property</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
  </tr>
  <tr>
    <td style="padding:15px">auth_method</td>
    <td style="padding:15px">Required. Used to define the type of authentication currently supported. Authentication methods currently supported are: `basic user_password`, `static_token`, `request_token`, and `no_authentication`.</td>
  </tr>
  <tr>
    <td style="padding:15px">username</td>
    <td style="padding:15px">Used to authenticate with Servicenow on every request or when pulling a token that will be used in subsequent requests.</td>
  </tr>
  <tr>
    <td style="padding:15px">password</td>
    <td style="padding:15px">Used to authenticate with Servicenow on every request or when pulling a token that will be used in subsequent requests.</td>
  </tr>
  <tr>
    <td style="padding:15px">token</td>
    <td style="padding:15px">Defines a static token that can be used on all requests. Only used with `static_token` as an authentication method (auth\_method).</td>
  </tr>
  <tr>
    <td style="padding:15px">invalid_token_error</td>
    <td style="padding:15px">Defines the HTTP error that is received when the token is invalid. Notifies the adapter to pull a new token and retry the request. Default is 401.</td>
  </tr>
  <tr>
    <td style="padding:15px">token_timeout</td>
    <td style="padding:15px">Defines how long a token is valid. Measured in milliseconds. Once a dynamic token is no longer valid, the adapter has to pull a new token. If the token_timeout is set to -1, the adapter will pull a token on every request to Servicenow. If the timeout_token is 0, the adapter will use the expiration from the token response to determine when the token is no longer valid.</td>
  </tr>
  <tr>
    <td style="padding:15px">token_cache</td>
    <td style="padding:15px">Used to determine where the token should be stored (local memory or in Redis).</td>
  </tr>
  <tr>
    <td style="padding:15px">auth_field</td>
    <td style="padding:15px">Defines the request field the authentication (e.g., token are basic auth credentials) needs to be placed in order for the calls to work.</td>
  </tr>
  <tr>
    <td style="padding:15px">auth_field_format</td>
    <td style="padding:15px">Defines the format of the auth\_field. See examples below. Items enclosed in {} inform the adapter to perofrm an action prior to sending the data. It may be to replace the item with a value or it may be to encode the item.</td>
  </tr>
  <tr>
    <td style="padding:15px">auth_logging</td>
    <td style="padding:15px">Setting this true will add some additional logs but this should only be done when trying to debug an issue as certain credential information may be logged out when this is true.</td>
  </tr>
  <tr>
    <td style="padding:15px">client_id</td>
    <td style="padding:15px">Provide a client id when needed, this is common on some types of OAuth.</td>
  </tr>
  <tr>
    <td style="padding:15px">client_secret</td>
    <td style="padding:15px">Provide a client secret when needed, this is common on some types of OAuth.</td>
  </tr>
  <tr>
    <td style="padding:15px">grant_type</td>
    <td style="padding:15px">Provide a grant type when needed, this is common on some types of OAuth.</td>
  </tr>
</table>
<br>

#### Examples of authentication field format

```json
"{token}"
"Token {token}"
"{username}:{password}"
"Basic {b64}{username}:{password}{/b64}"
```

### Healthcheck Properties

The healthcheck properties defines the API that runs the healthcheck to tell the adapter that it can reach Servicenow. There are currently three types of healthchecks.

- None - Not recommended. Adapter will not run a healthcheck. Consequently, unable to determine before making a request if the adapter can reach Servicenow.
- Startup - Adapter will check for connectivity when the adapter initially comes up, but it will not check afterwards.
- Intermittent - Adapter will check connectivity to Servicenow at a frequency defined in the `frequency` property.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Property</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
  </tr>
  <tr>
    <td style="padding:15px">type</td>
    <td style="padding:15px">Required. The type of health check to run.</td>
  </tr>
  <tr>
    <td style="padding:15px">frequency</td>
    <td style="padding:15px">Required if intermittent. Defines how often the health check should run. Measured in milliseconds. Default is 300000.</td>
  </tr>
  <tr>
    <td style="padding:15px">query_object</td>
    <td style="padding:15px">Query parameters to be added to the adapter healthcheck call.</td>
  </tr>
</table>
<br>

### Request Properties

The request section defines properties to help handle requests.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Property</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
  </tr>
  <tr>
    <td style="padding:15px">number_redirects</td>
    <td style="padding:15px">Optional. Tells the adapter that the request may be redirected and gives it a maximum number of redirects to allow before returning an error. Default is 0 - no redirects.</td>
  </tr>
  <tr>
    <td style="padding:15px">number_retries</td>
    <td style="padding:15px">Tells the adapter how many times to retry a request that has either aborted or reached a limit error before giving up and returning an error.</td>
  </tr>
  <tr>
    <td style="padding:15px">limit_retry_error</td>
    <td style="padding:15px">Optional. Can be either an integer or an array. Indicates the http error status number to define that no capacity was available and, after waiting a short interval, the adapter can retry the request. If an array is provvided, the array can contain integers or strings. Strings in the array are used to define ranges (e.g. "502-506"). Default is [0].</td>
  </tr>
  <tr>
    <td style="padding:15px">failover_codes</td>
    <td style="padding:15px">An array of error codes for which the adapter will send back a failover flag to IAP so that the Platform can attempt the action in another adapter.</td>
  </tr>
  <tr>
    <td style="padding:15px">attempt_timeout</td>
    <td style="padding:15px">Optional. Tells how long the adapter should wait before aborting the attempt. On abort, the adapter will do one of two things: 1) return the error; or 2) if **healthcheck\_on\_timeout** is set to true, it will abort the request and run a Healthcheck until it re-establishes connectivity to Servicenow, and then will re-attempt the request that aborted. Default is 5000 milliseconds.</td>
  </tr>
  <tr>
    <td style="padding:15px">global_request</td>
    <td style="padding:15px">Optional. This is information that the adapter can include in all requests to the other system. This is easier to define and maintain than adding this information in either the code (adapter.js) or the action files.</td>
  </tr>
  <tr>
    <td style="padding:15px">global_request -> payload</td>
    <td style="padding:15px">Optional. Defines any information that should be included on all requests sent to the other system that have a payload/body.</td>
  </tr>
  <tr>
    <td style="padding:15px">global_request -> uriOptions</td>
    <td style="padding:15px">Optional. Defines any information that should be sent as untranslated  query options (e.g. page, size) on all requests to the other system.</td>
  </tr>
  <tr>
    <td style="padding:15px">global_request -> addlHeaders</td>
    <td style="padding:15px">Optioonal. Defines any headers that should be sent on all requests to the other system.</td>
  </tr>
  <tr>
    <td style="padding:15px">global_request -> authData</td>
    <td style="padding:15px">Optional. Defines any additional authentication data used to authentice with the other system. This authData needs to be consistent on every request.</td>
  </tr>
  <tr>
    <td style="padding:15px">healthcheck_on_timeout</td>
    <td style="padding:15px">Required. Defines if the adapter should run a health check on timeout. If set to true, the adapter will abort the request and run a health check until it re-establishes connectivity and then it will re-attempt the request.</td>
  </tr>
  <tr>
    <td style="padding:15px">return_raw</td>
    <td style="padding:15px">Optional. Tells the adapter whether the raw response should be returned as well as the IAP response. This is helpful when running integration tests to save mock data. It does add overhead to the response object so it is not ideal from production.</td>
  </tr>
  <tr>
    <td style="padding:15px">archiving</td>
    <td style="padding:15px">Optional flag. Default is false. It archives the request, the results and the various times (wait time, Servicenow time and overall time) in the `adapterid_results` collection in MongoDB. Although archiving might be desirable, be sure to develop a strategy before enabling this capability. Consider how much to archive and what strategy to use for cleaning up the collection in the database so that it does not become too large, especially if the responses are large.</td>
  </tr>
  <tr>
    <td style="padding:15px">return_request</td>
    <td style="padding:15px">Optional flag. Default is false. Will return the actual request that is made including headers. This should only be used during debugging issues as there could be credentials in the actual request.</td>
  </tr>
</table>
<br>

### SSL Properties

The SSL section defines the properties utilized for ssl authentication with Servicenow. SSL can work two different ways: set the `accept\_invalid\_certs` flag to true (only recommended for lab environments), or provide a `ca\_file`.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Property</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
  </tr>
  <tr>
    <td style="padding:15px">enabled</td>
    <td style="padding:15px">If SSL is required, set to true.</td>
  </tr>
  <tr>
    <td style="padding:15px">accept_invalid_certs</td>
    <td style="padding:15px">Defines if the adapter should accept invalid certificates (only recommended for lab environments). Required if SSL is enabled. Default is false.</td>
  </tr>
  <tr>
    <td style="padding:15px">ca_file</td>
    <td style="padding:15px">Defines the path name to the CA file used for SSL. If SSL is enabled and the accept invalid certifications is false, then ca_file is required.</td>
  </tr>
  <tr>
    <td style="padding:15px">key_file</td>
    <td style="padding:15px">Defines the path name to the Key file used for SSL. The key_file may be needed for some systems but it is not required for SSL.</td>
  </tr>
  <tr>
    <td style="padding:15px">cert_file</td>
    <td style="padding:15px">Defines the path name to the Certificate file used for SSL. The cert_file may be needed for some systems but it is not required for SSL.</td>
  </tr>
  <tr>
    <td style="padding:15px">secure_protocol</td>
    <td style="padding:15px">Defines the protocol (e.g., SSLv3_method) to use on the SSL request.</td>
  </tr>
  <tr>
    <td style="padding:15px">ciphers</td>
    <td style="padding:15px">Required if SSL enabled. Specifies a list of SSL ciphers to use.</td>
  </tr>
  <tr>
    <td style="padding:15px">ecdhCurve</td>
    <td style="padding:15px">During testing on some Node 8 environments, you need to set `ecdhCurve` to auto. If you do not, you will receive PROTO errors when attempting the calls. This is the only usage of this property and to our knowledge it only impacts Node 8 and 9.</td>
  </tr>
</table>
<br>

### Throttle Properties

The throttle section is used when requests to Servicenow must be queued (throttled). All of the properties in this section are optional.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Property</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
  </tr>
  <tr>
    <td style="padding:15px">throttle_enabled</td>
    <td style="padding:15px">Default is false. Defines if the adapter should use throttling or not.</td>
  </tr>
  <tr>
    <td style="padding:15px">number_pronghorns</td>
    <td style="padding:15px">Default is 1. Defines if throttling is done in a single Itential instance or whether requests are being throttled across multiple Itential instances (minimum = 1, maximum = 20). Throttling in a single Itential instance uses an in-memory queue so there is less overhead. Throttling across multiple Itential instances requires placing the request and queue information into a shared resource (e.g. database) so that each instance can determine what is running and what is next to run. Throttling across multiple instances requires additional I/O overhead.</td>
  </tr>
  <tr>
    <td style="padding:15px">sync-async</td>
    <td style="padding:15px">This property is not used at the current time (it is for future expansion of the throttling engine).</td>
  </tr>
  <tr>
    <td style="padding:15px">max_in_queue</td>
    <td style="padding:15px">Represents the maximum number of requests the adapter should allow into the queue before rejecting requests (minimum = 1, maximum = 5000). This is not a limit on what the adapter can handle but more about timely responses to requests. The default is currently 1000.</td>
  </tr>
  <tr>
    <td style="padding:15px">concurrent_max</td>
    <td style="padding:15px">Defines the number of requests the adapter can send to Servicenow at one time (minimum = 1, maximum = 1000). The default is 1 meaning each request must be sent to Servicenow in a serial manner.</td>
  </tr>
  <tr>
    <td style="padding:15px">expire_timeout</td>
    <td style="padding:15px">Default is 0. Defines a graceful timeout of the request session. After a request has completed, the adapter will wait additional time prior to sending the next request. Measured in milliseconds (minimum = 0, maximum = 60000).</td>
  </tr>
  <tr>
    <td style="padding:15px">average_runtime</td>
    <td style="padding:15px">Represents the approximate average of how long it takes Servicenow to handle each request. Measured in milliseconds (minimum = 50, maximum = 60000). Default is 200. This metric has performance implications. If the runtime number is set too low, it puts extra burden on the CPU and memory as the requests will continually try to run. If the runtime number is set too high, requests may wait longer than they need to before running. The number does not need to be exact but your throttling strategy depends heavily on this number being within reason. If averages range from 50 to 250 milliseconds you might pick an average run-time somewhere in the middle so that when Servicenow performance is exceptional you might run a little slower than you might like, but when it is poor you still run efficiently.</td>
  </tr>
  <tr>
    <td style="padding:15px">priorities</td>
    <td style="padding:15px">An array of priorities and how to handle them in relation to the throttle queue. Array of objects that include priority value and percent of queue to put the item ex { value: 1, percent: 10 }</td>
  </tr>
</table>
<br>

### Proxy Properties

The proxy section defines the properties to utilize when Servicenow is behind a proxy server.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Property</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
  </tr>
  <tr>
    <td style="padding:15px">enabled</td>
    <td style="padding:15px">Required. Default is false. If Servicenow is behind a proxy server, set enabled flag to true.</td>
  </tr>
  <tr>
    <td style="padding:15px">host</td>
    <td style="padding:15px">Host information for the proxy server. Required if `enabled` is true.</td>
  </tr>
  <tr>
    <td style="padding:15px">port</td>
    <td style="padding:15px">Port information for the proxy server. Required if `enabled` is true.</td>
  </tr>
  <tr>
    <td style="padding:15px">protocol</td>
    <td style="padding:15px">The protocol (i.e., http, https, etc.) used to connect to the proxy. Default is http.</td>
  </tr>
  <tr>
    <td style="padding:15px">username</td>
    <td style="padding:15px">If there is authentication for the proxy, provide the username here.</td>
  </tr>
  <tr>
    <td style="padding:15px">password</td>
    <td style="padding:15px">If there is authentication for the proxy, provide the password here.</td>
  </tr>
</table>
<br>

### Mongo Properties

The mongo section defines the properties used to connect to a Mongo database. Mongo can be used for throttling as well as to persist metric data. If not provided, metrics will be stored in the file system.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Property</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
  </tr>
  <tr>
    <td style="padding:15px">host</td>
    <td style="padding:15px">Optional. Host information for the mongo server.</td>
  </tr>
  <tr>
    <td style="padding:15px">port</td>
    <td style="padding:15px">Optional. Port information for the mongo server.</td>
  </tr>
  <tr>
    <td style="padding:15px">database</td>
    <td style="padding:15px">Optional. The database for the adapter to use for its data.</td>
  </tr>
  <tr>
    <td style="padding:15px">username</td>
    <td style="padding:15px">Optional. If credentials are required to access mongo, this is the user to login as.</td>
  </tr>
  <tr>
    <td style="padding:15px">password</td>
    <td style="padding:15px">Optional. If credentials are required to access mongo, this is the password to login with.</td>
  </tr>
  <tr>
    <td style="padding:15px">replSet</td>
    <td style="padding:15px">Optional. If the database is set up to use replica sets, define it here so it can be added to the database connection.</td>
  </tr>
  <tr>
    <td style="padding:15px">db_ssl</td>
    <td style="padding:15px">Optional. Contains information for SSL connectivity to the database.</td>
  </tr>
  <tr>
    <td style="padding:15px">db_ssl -> enabled</td>
    <td style="padding:15px">If SSL is required, set to true.</td>
  </tr>
  <tr>
    <td style="padding:15px">db_ssl -> accept_invalid_cert</td>
    <td style="padding:15px">Defines if the adapter should accept invalid certificates (only recommended for lab environments). Required if SSL is enabled. Default is false.</td>
  </tr>
  <tr>
    <td style="padding:15px">db_ssl -> ca_file</td>
    <td style="padding:15px">Defines the path name to the CA file used for SSL. If SSL is enabled and the accept invalid certifications is false, then ca_file is required.</td>
  </tr>
  <tr>
    <td style="padding:15px">db_ssl -> key_file</td>
    <td style="padding:15px">Defines the path name to the Key file used for SSL. The key_file may be needed for some systems but it is not required for SSL.</td>
  </tr>
  <tr>
    <td style="padding:15px">db_ssl -> cert_file</td>
    <td style="padding:15px">Defines the path name to the Certificate file used for SSL. The cert_file may be needed for some systems but it is not required for SSL.</td>
  </tr>
</table>
<br>

### Device Broker Properties

The device broker section defines the properties used integrate Servicenow to the device broker. Each broker call is represented and has an array of calls that can be used to build the response. This describes the calls and then the fields which are available in the calls.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Property</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
  </tr>
  <tr>
    <td style="padding:15px">getDevice</td>
    <td style="padding:15px">The array of calls used to get device details for the broker</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevicesFiltered</td>
    <td style="padding:15px">The array of calls used to get devices for the broker</td>
  </tr>
  <tr>
    <td style="padding:15px">isAlive</td>
    <td style="padding:15px">The array of calls used to get device status for the broker</td>
  </tr>
  <tr>
    <td style="padding:15px">getConfig</td>
    <td style="padding:15px">The array of calls used to get device configuration for the broker</td>
  </tr>
  <tr>
    <td style="padding:15px">getCount</td>
    <td style="padding:15px">The array of calls used to get device configuration for the broker</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevice/getDevicesFiltered/isAlive/getConfig/getCount -> path</td>
    <td style="padding:15px">The path, not including the base_path and version, for making this call</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevice/getDevicesFiltered/isAlive/getConfig/getCount -> method</td>
    <td style="padding:15px">The rest method for making this call</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevice/getDevicesFiltered/isAlive/getConfig/getCount -> query</td>
    <td style="padding:15px">Query object containing and query parameters and their values for this call</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevice/getDevicesFiltered/isAlive/getConfig/getCount -> body</td>
    <td style="padding:15px">Body object containing the payload for this call</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevice/getDevicesFiltered/isAlive/getConfig/getCount -> headers</td>
    <td style="padding:15px">Header object containing the headers for this call.</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevice/getDevicesFiltered/isAlive/getConfig/getCount -> handleFailure</td>
    <td style="padding:15px">Tells the adapter whether to "fail" or "ignore" failures if they occur.</td>
  </tr>
  <tr>
    <td style="padding:15px">isAlive -> statusValue</td>
    <td style="padding:15px">Tells the adapter what value to look for in the status field to determine if the device is alive.</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevice/getDevicesFiltered/isAlive/getConfig -> requestFields</td>
    <td style="padding:15px">Object containing fields the adapter should send on the request and where it should get the data. The where can be from a response to a getDevicesFiltered or a static value.</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevice/getDevicesFiltered/isAlive/getConfig -> responseFields</td>
    <td style="padding:15px">Object containing fields the adapter should set to send back to iap and where the value should come from in the response or request data.</td>
  </tr>
</table>
<br>


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

### Authentication

This document will go through the steps for authenticating the ServiceNow adapter with the authentication methods we have worked with in the past. Properly configuring the properties for an adapter in IAP is critical for getting the adapter online. You can read more about adapter authentication <a href="https://docs.itential.com/opensource/docs/authentication" target="_blank">HERE</a>.

Companies periodically change authentication methods to provide better security. As this happens this section should be updated and contributed/merge back into the adapter repository.

#### Basic Authentication
The ServiceNow adapter authenticates with a basic authentication.

STEPS  
1. Ensure you have access to a ServiceNow server and that it is running
2. Follow the steps in the README.md to import the adapter into IAP if you have not already done so
3. Use the properties below for the ```properties.authentication``` field
```json
"authentication": {
  "auth_method": "basic user_password",
  "username": "<your username>",
  "password": "<your password>",
  "auth_field": "header.headers.Authorization",
  "auth_field_format": "Basic {b64}{username}:{password}{/b64}",
  "auth_logging": false
}
```
you can leave all of the other properties in the authentication section, they will not be used when the auth_method is basic user_password.
4. Restart the adapter. If your properties were set correctly, the adapter should go online. 

#### Troubleshooting
- Make sure you copied over the correct username and password.
- Turn on debug level logs for the adapter in IAP Admin Essentials.
- Turn on auth_logging for the adapter in IAP Admin Essentials (adapter properties).
- Investigate the logs - in particular:
  - The FULL REQUEST log to make sure the proper headers are being sent with the request.
  - The FULL BODY log to make sure the payload is accurate.
  - The CALL RETURN log to see what the other system is telling us.
- Credentials should be ** masked ** by the adapter so make sure you verify the username and password - including that there are erroneous spaces at the front or end.
- Remember when you are done to turn auth_logging off as you do not want to log credentials.

## Additional Information

### Enhancements

#### Adding a Second Instance of an Adapter

You can add a second instance of this adapter without adding new code on the file system. To do this go into the IAP Admin Essentials and add a new service config for this adapter. The two instances of the adapter should have unique ids. In addition, they should point to different instances (unique host and port) of the other system.

#### Adding Adapter Calls

There are multiple ways to add calls to an existing adapter.

The easiest way would be to use the Adapter Builder update process. This process takes in a Swagger or OpenAPI document, allows you to select the calls you want to add and then generates a zip file that can be used to update the adapter. Once you have the zip file simply put it in the adapter directory and execute `npm run adapter:update`.

```bash
mv updatePackage.zip adapter-servicenow
cd adapter-servicenow
npm run adapter:update
```

If you do not have a Swagger or OpenAPI document, you can use a Postman Collection and convert that to an OpenAPI document using APIMatic and then follow the first process.

If you want to manually update the adapter that can also be done the key thing is to make sure you update all of the right files. Within the entities directory you will find 1 or more entities. You can create a new entity or add to an existing entity. Each entity has an action.json file, any new call will need to be put in the action.json file. It will also need to be added to the enum for the ph_request_type in the appropriate schema files. Once this configuration is complete you will need to add the call to the adapter.js file and, in order to make it available as a workflow task in IAP, it should also be added to the pronghorn.json file. You can optionally add it to the unit and integration test files. There is more information on how to work on each of these files in the <a href="https://docs.itential.com/opensource/docs/adapters" target="_blank">Adapter Technical Resources</a> on our Documentation Site.

```text
Files to update
* entities/<entity>/action.json: add an action
* entities/<entity>/schema.json (or the schema defined on the action): add action to the enum for ph_request_type
* adapter.js: add the new method and make sure it calls the proper entity and action
* pronghorn.json: add the new method
* test/unit/adapterTestUnit.js (optional but best practice): add unit test(s) - function is there, any required parameters error when not passed in
* test/integration/adapterTestIntegration.js (optional but best practice): add integration test
```

#### Adding Adapter Properties

While changing adapter properties is done in the service instance configuration section of IAP, adding properties has to be done in the adapter. To add a property you should edit the propertiesSchema.json with the proper information for the property. In addition, you should modify the sampleProperties to have the new property in it.

```text
Files to update
* propertiesSchema.json: add the new property and how it is defined
* sampleProperties: add the new property with a default value
* test/unit/adapterTestUnit.js (optional but best practice): add the property to the global properties
* test/integration/adapterTestIntegration.js (optional but best practice): add the property to the global properties
```

#### Changing Adapter Authentication

Often an adapter is built before knowing the authentication and authentication processes can also change over time. The adapter supports many different kinds of authentication but it does require configuration. Some forms of authentication can be defined entirely with the adapter properties but others require configuration.

```text
Files to update
* entities/.system/action.json: change the getToken action as needed
* entities/.system/schemaTokenReq.json: add input parameters (external name is name in other system)
* entities/.system/schemaTokenResp.json: add response parameters (external name is name in other system)
* propertiesSchema.json: add any new property and how it is defined
* sampleProperties: add any new property with a default value
* test/unit/adapterTestUnit.js (optional but best practice): add the property to the global properties
* test/integration/adapterTestIntegration.js (optional but best practice): add the property to the global properties
```

#### Enhancing Adapter Integration Tests

The adapter integration tests are written to be able to test in either stub (standalone) mode or integrated to the other system. However, if integrating to the other system, you may need to provide better data than what the adapter provides by default as that data is likely to fail for create and update. To provide better data, edit the adapter integration test file. Make sure you do not remove the marker and keep custom code below the marker so you do not impact future migrations. Once the edits are complete, run the integration test as it instructs you to above. When you run integrated to the other system, you can also save mockdata for future use by changing the isSaveMockData flag to true.

```text
Files to update
* test/integration/adapterTestIntegration.js: add better data for the create and update calls so that they will not fail.
```

As mentioned previously, for most of these changes as well as other possible changes, there is more information on how to work on an adapter in the <a href="https://docs.itential.com/opensource/docs/adapters" target="_blank">Adapter Technical Resources</a> on our Documentation Site.

### Contributing

First off, thanks for taking the time to contribute!

The following is a set of rules for contributing.

#### Code of Conduct

This project and everyone participating in it is governed by the Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to support@itential.com.

#### How to Contribute

Follow the contributing guide (here)[https://gitlab.com/itentialopensource/adapters/contributing-guide]

### Helpful Links

<a href="https://docs.itential.com/opensource/docs/adapters" target="_blank">Adapter Technical Resources</a>

### Node Scripts

There are several node scripts that now accompany the adapter. These scripts are provided to make several activities easier. Many of these scripts can have issues with different versions of IAP as they have dependencies on IAP and Mongo. If you have issues with the scripts please report them to the Itential Adapter Team. Each of these scripts are described below.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Run</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
  </tr>
  <tr>
    <td style="padding:15px">npm run adapter:install</td>
    <td style="padding:15px">Provides an easier way to install the adapter.</td>
  </tr>
  <tr>
    <td style="padding:15px">npm run adapter:checkMigrate</td>
    <td style="padding:15px">Checks whether your adapter can and should be migrated to the latest foundation.</td>
  </tr>
  <tr>
    <td style="padding:15px">npm run adapter:findPath</td>
    <td style="padding:15px">Can be used to see if the adapter supports a particular API call.</td>
  </tr>
  <tr>
    <td style="padding:15px">npm run adapter:migrate</td>
    <td style="padding:15px">Provides an easier way to update your adapter after you download the migration zip from Itential DevSite.</td>
  </tr>
  <tr>
    <td style="padding:15px">npm run adapter:update</td>
    <td style="padding:15px">Provides an easier way to update your adapter after you download the update zip from Itential DevSite.</td>
  </tr>
  <tr>
    <td style="padding:15px">npm run adapter:revert</td>
    <td style="padding:15px">Allows you to revert after a migration or update if it resulted in issues.</td>
  </tr>
  <tr>
    <td style="padding:15px">npm run troubleshoot</td>
    <td style="padding:15px">Provides a way to troubleshoot the adapter - runs connectivity, healthcheck and basic get.</td>
  </tr>
  <tr>
    <td style="padding:15px">npm run connectivity</td>
    <td style="padding:15px">Provides a connectivity check to the Servicenow system.</td>
  </tr>
  <tr>
    <td style="padding:15px">npm run healthcheck</td>
    <td style="padding:15px">Checks whether the configured healthcheck call works to Servicenow.</td>
  </tr>
  <tr>
    <td style="padding:15px">npm run basicget</td>
    <td style="padding:15px">Checks whether the basic get calls works to Servicenow.</td>
  </tr>
</table>
<br>

## Troubleshoot

Run `npm run troubleshoot` to start the interactive troubleshooting process. The command allows you to verify and update connection, authentication as well as healthcheck configuration. After that it will test these properties by sending HTTP request to the endpoint. If the tests pass, it will persist these changes into IAP.

You also have the option to run individual commands to perform specific test:

- `npm run healthcheck` will perform a healthcheck request of with current setting.
- `npm run basicget` will perform some non-parameter GET request with current setting.
- `npm run connectivity` will perform networking diagnostics of the adatper endpoint.

### Connectivity Issues

1. You can run the adapter troubleshooting script which will check connectivity, run the healthcheck and run basic get calls.

```bash
npm run troubleshoot
```

2. Verify the adapter properties are set up correctly.

```text
Go into the Itential Platform GUI and verify/update the properties
```

3. Verify there is connectivity between the Itential Platform Server and Servicenow Server.

```text
ping the ip address of Servicenow server
try telnet to the ip address port of Servicenow
execute a curl command to the other system
```

4. Verify the credentials provided for Servicenow.

```text
login to Servicenow using the provided credentials
```

5. Verify the API of the call utilized for Servicenow Healthcheck.

```text
Go into the Itential Platform GUI and verify/update the properties
```

### Functional Issues

Adapter logs are located in `/var/log/pronghorn`. In older releases of the Itential Platform, there is a `pronghorn.log` file which contains logs for all of the Itential Platform. In newer versions, adapters can be configured to log into their own files.


