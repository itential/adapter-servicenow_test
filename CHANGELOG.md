
## 2.8.2 [12-23-2023]

* meta change - tags

See merge request itentialopensource/adapters/itsm-testing/adapter-servicenow!29

---

## 2.8.1 [12-23-2023]

* update axios and metadata

See merge request itentialopensource/adapters/itsm-testing/adapter-servicenow!28

---

## 2.8.0 [12-14-2023]

* More migration changes

See merge request itentialopensource/adapters/itsm-testing/adapter-servicenow!27

---

## 2.7.0 [11-06-2023]

* More migration changes

See merge request itentialopensource/adapters/itsm-testing/adapter-servicenow!27

---

## 2.6.4 [10-19-2023]

* add standard openapi documents

See merge request itentialopensource/adapters/itsm-testing/adapter-servicenow!26

---

## 2.6.3 [09-11-2023]

* add standard openapi documents

See merge request itentialopensource/adapters/itsm-testing/adapter-servicenow!26

---

## 2.6.2 [09-11-2023]

* more meta changes

See merge request itentialopensource/adapters/itsm-testing/adapter-servicenow!25

---

## 2.6.1 [09-05-2023]

* metadata changes

See merge request itentialopensource/adapters/itsm-testing/adapter-servicenow!24

---

## 2.6.0 [08-16-2023]

* Minor/2023 migration

See merge request itentialopensource/adapters/itsm-testing/adapter-servicenow!23

---

## 2.5.0 [08-11-2023]

* Minor/2023 migration

See merge request itentialopensource/adapters/itsm-testing/adapter-servicenow!23

---

## 2.4.5 [08-03-2023]

* More metadata changes

See merge request itentialopensource/adapters/itsm-testing/adapter-servicenow!21

---

## 2.4.4 [07-12-2023]

* fix meta comma

See merge request itentialopensource/adapters/itsm-testing/adapter-servicenow!20

---

## 2.4.3 [07-10-2023]

* Patch/prototype metadata

See merge request itentialopensource/adapters/itsm-testing/adapter-servicenow!19

---

## 2.4.2 [04-04-2023]

* Utils version has been updated in package.json, and the changes are being migrated to the adapter

See merge request itentialopensource/adapters/itsm-testing/adapter-servicenow!17

---

## 2.4.1 [11-23-2022]

* Changes to System Info Markdown

See merge request itentialopensource/adapters/itsm-testing/adapter-servicenow!16

---

## 2.4.0 [05-25-2022]

* Migration to the latest Adapter Foundation

See merge request itentialopensource/adapters/itsm-testing/adapter-servicenow!13

---

## 2.3.0 [03-10-2021]

- Added calls for Updating a Normal Change Request, Setting Risk Assessment for Change Request and Auto Approving a Change Request. Also needed to change how the data is sent on CreateNormalChangeRequest

See merge request itentialopensource/adapters/itsm-testing/adapter-servicenow!12

---

## 2.2.2 [03-10-2021]

- Migration to bring up to the latest foundation
  - Change to .eslintignore (adapter_modification directory)
  - Change to README.md (new properties, new scripts, new processes)
  - Changes to adapterBase.js (new methods)
  - Changes to package.json (new scripts, dependencies)
  - Changes to propertiesSchema.json (new properties and changes to existing)
  - Changes to the Unit test
  - Adding several test files, utils files and .generic entity
  - Fix order of scripts and dependencies in package.json
  - Fix order of properties in propertiesSchema.json
  - Update sampleProperties, unit and integration tests to have all new properties.
  - Add all new calls to adapter.js and pronghorn.json
  - Add suspend piece to older methods

See merge request itentialopensource/adapters/itsm-testing/adapter-servicenow!11

---

## 2.2.1 [07-10-2020]

- Update the adapter to the latest foundation

See merge request itentialopensource/adapters/itsm-testing/adapter-servicenow!10

---

## 2.2.0 [04-15-2020]

- Added a task to query any table by name with sysparm_limit, sysparm_query and sysparm_fields

See merge request itentialopensource/adapters/itsm-testing/adapter-servicenow!9

---

## 2.1.2 [01-16-2020]

- Update the adapter to the latest foundation

See merge request itentialopensource/adapters/itsm-testing/adapter-servicenow!8

---

## 2.1.1 [01-16-2020]

- Fixes healthcheck not limiting responses to 1 item

See merge request itentialopensource/adapters/itsm-testing/adapter-servicenow!7

---

## 2.1.0 [11-08-2019]

- Update the adapter to the latest adapter foundation.
  - Updating to adapter-utils 4.24.3 (automatic)
  - Add sample token schemas (manual)
  - Adding placement property to getToken response schema (manual - before encrypt)
  - Adding sso default into action.json for getToken (manual - before response object)
  - Add new adapter properties for metrics & mock (save_metric, mongo and return_raw) (automatic - check place manual before stub)
  - Update sample properties to include new properties (manual)
  - Update integration test for raw mockdata (automatic)
  - Update test properties (manual)
  - Changes to artifactize (automatic)
  - Update type in sampleProperties so it is correct for the adapter (manual)
  - Update the readme (automatic)

See merge request itentialopensource/adapters/itsm-testing/adapter-servicenow!6

---

## 2.0.0 [10-01-2019]

- Enhances many of the calls in the adapter (118 of 142 - integration tests now work while integrated to ServiceNow). There are still some calls (24) that require plugins and other things to exist so testing these is very difficult and will require even more time. There are also a couple of calls that have been tested but with data specific to a particular ServiceNow instance so they are likely to fail integrated with another ServiceNow instance.

See merge request itentialopensource/adapters/itsm-testing/adapter-servicenow!5

---

## 1.0.0 [09-18-2019]

- Mimics current itential/adapter-servicenow calls. Adds Oauth token support in action schema's

See merge request itentialopensource/adapters/itsm-testing/adapter-servicenow!4

---

##  [09-06-2019] & 0.4.0 [08-21-2019] & 0.3.0 [07-30-2019] & 0.2.0 [07-17-2019]

- Migrate the adapter to the latest foundation, categorize and prepare it for app artifact

See merge request itentialopensource/adapters/itsm-testing/adapter-servicenow!3

---

## 0.1.4 [06-13-2019]

- Added the missing param

See merge request itentialopensource/adapters/adapter-servicenow!2

---

## 0.1.3 [06-07-2019] & 0.1.2 [06-05-2019]

- Creates mock data from integration test data responses and fixes stub test

See merge request itentialopensource/adapters/adapter-servicenow!1

---

## 0.1.1 [05-29-2019]

- Initial Commit

See commit a4b075a

---
