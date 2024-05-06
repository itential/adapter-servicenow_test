# Adapter for ServiceNow

Vendor: ServiceNow
Homepage: https://www.servicenow.com/

Product: IT Service Management
Product Page: https://www.servicenow.com/products/itsm.html

## Introduction
We classify ServiceNow into the ITSM domain as ServiceNow provides this capability to its users. This includes incident/problem management, change management and request/ordering. We also classify it into the Inventory and Discovery domains because it contains the ability to discover devices in the network and adds these devices to its CMDB.

"ServiceNow provides standardd processes for many IT Servicde Management areas incliding incident, process, request and change." 

## Why Integrate
The ServiceNow adapter from Itential is used to integrate the Itential Automation Platform (IAP) with ServiceNow IT Service Management. With this adapter you have the ability to perform operations such as:

- Create, Modify Permissions for, and Complete Change Requests: Prior to IAP, making a change requires approval and scheduling. Itential can automatically create a change request in ServiceNow to go through the Change Management process. Itential can verify that the change request has been approved. If the change is not approved Itential will wait and check again at a later time. Once Itential has finished making the change, it can complete the change request in ServiceNow.

- Open and Close Tickets: When there is a failure or error in the Itential job that needs to be addressed by a ServiceNow team, Itential can automatically create the ticket in ServiceNow. When Itential successfully completes a job resolving a ServiceNow ticket, it can automatically close that ticket.

- Add, Manage, and Remove Inventory Devices: When Itential turns up a new device on the network, it can add the device to the ServiceNow CMDB, request that ServiceNow discover the new device, or remove the device from the ServiceNow CMDB.

- Update and Close a Service Catalog Request: Once an Itential job is created from a ServiceNow Service Catalog Request or Request Item, Itential can update that request with information as the job is being worked. Once an Itential job is created from a ServiceNow Service Catalog Request or Request Item, Itential can close that request when the job is completed.

- Send Notifications to ServiceNow Assignees and Approvers: When pertinent actions or activities occur in a job on the Itential platform, Itential can send notifications to assignees on related ServiceNow tickets.

- Change ServiceNow Assignees: Itential can change the assignees of a ServiceNow ticket (e.g. Incident, Problem, Change, Request, etc.) based on what has occurred in the Itential job.

- Create and Retrieve Knowledge Base Articles: For any IAP job that is related to a ServiceNow ticket (e.g. Incident, Problem, etc.), Itential can create a knowledge base article with information on what was done in the job to resolve that particular issue. When an Itential job has an issue, IAP can retrieve knowledge base articles that may help to resolve the issue.

## Additional Product Documentation
The [API documents for ServiceNow](https://developer.servicenow.com/dev.do#!/learn/learning-plans/tokyo/new_to_servicenow/app_store_learnv2_scripting_tokyo_servicenow_apis)
