/* eslint-disable no-console */
/* eslint import/no-unresolved: warn */
/* eslint global-require: warn */

// suppress eslint rule in adapter
/* eslint arrow-parens: warn */
/* eslint import/no-extraneous-dependencies: warn */
/* eslint import/no-dynamic-require: warn */

const program = require('commander');
const rls = require('readline-sync');
const prompts = require('prompts');
const utils = require('./tbUtils');
const basicGet = require('./basicGet');
const { name } = require('../package.json');
const sampleProperties = require('../sampleProperties.json');
const adapterPronghorn = require('../pronghorn.json');
const { addAuthInfo } = require('./addAuth');

const { troubleshoot, offline } = require('./troubleshootingAdapter');

const executeInStandaloneMode = async (command) => {
  console.info('\n> Executing the script outside of IAP installation directory');
  console.info('> Using sampleProperties.json configuration');
  switch (command) {
    case 'install': {
      console.error('Not currently in IAP directory - installation not possible');
      break;
    }
    case 'connectivity': {
      const { host } = sampleProperties.properties;
      console.log(`perform networking diagnositics to ${host}`);
      utils.runConnectivity(host);
      break;
    }
    case 'healthcheck': {
      const a = basicGet.getAdapterInstance({ properties: sampleProperties });
      await utils.healthCheck(a);
      break;
    }
    case 'basicget': {
      utils.runBasicGet();
      break;
    }
    default: {
      if (rls.keyInYN('Troubleshooting without IAP?')) {
        await offline();
      }
    }
  }
  process.exit(0);
};

const getAdapterInstanceConfig = async (command) => {
  const instances = await utils.getAllAdapterInstances();
  if (!instances || instances.length === 0) {
    return console.log('None adapter instances found!');
  }

  let instance;
  if (instances.length === 1) {
    [instance] = instances;
  } else {
    const choices = instances.map((item) => ({ title: item.name }));
    const menu = {
      type: 'select',
      name: 'index',
      message: `Pick an adapter for ${command} check`,
      choices
    };

    console.log('\n');
    const selected = await prompts(menu);
    console.log('\n');
    instance = instances[selected.index];
  }

  if (!instance) {
    console.error('No adapter instance selected');
    return null;
  }

  const { serviceItem: adapterConfig } = await utils.getAdapterConfig(instance._id); /* eslint-disable-line no-underscore-dangle */

  console.log('\nAdapter instance configuration =>');
  console.log('======================================');
  console.log(adapterConfig);
  console.log('======================================');

  return adapterConfig;
};

const executeCommandOnInstance = async (command) => {
  const adapterConfig = await getAdapterInstanceConfig(command);
  if (!adapterConfig) {
    process.exit(0);
  }

  switch (command) {
    case 'connectivity': {
      const { host } = adapterConfig.properties.properties;
      console.log(`perform networking diagnositics to ${host}`);
      utils.runConnectivity(host, true);
      break;
    }
    case 'healthcheck': {
      const adapterInstance = basicGet.getAdapterInstance(adapterConfig);
      await utils.healthCheck(adapterInstance);
      break;
    }
    case 'basicget': {
      utils.runBasicGet(true);
      break;
    }
    case 'troubleshoot': {
      const adapter = { properties: adapterConfig };
      await troubleshoot({}, true, true, adapter);
      break;
    }
    default: {
      console.error(`Unknown command: ${command}`);
    }
  }
  return process.exit(0);
};

const executeUnderIAPInstallationDirectory = async (command) => {
  if (command === 'install') {
    const { database, serviceItem, pronghornProps } = await utils.getAdapterConfig();
    const filter = { id: pronghornProps.id };
    const profileItem = await database.collection(utils.IAP_PROFILES_COLLECTION).findOne(filter);
    if (!profileItem) {
      console.log(`Could not find IAP profile for id ${pronghornProps.id}`);
      process.exit(0);
    }
    if (serviceItem) {
      console.log(`A service by the name ${name} already exits!`);
      if (rls.keyInYN(`Do you want to completely remove ${name}?`)) {
        console.log(`Removing ${name} from db...`);
        await database.collection(utils.SERVICE_CONFIGS_COLLECTION).deleteOne({ model: name });
        console.log(`${name} removed from db.`);
        if (profileItem.services.includes(serviceItem.name)) {
          const serviceIndex = profileItem.services.indexOf(serviceItem.name);
          profileItem.services.splice(serviceIndex, 1);
          const update = { $set: { services: profileItem.services } };
          await database.collection(utils.IAP_PROFILES_COLLECTION).updateOne({ id: pronghornProps.id }, update);
          console.log(`${serviceItem.name} removed from profileItem.services.`);
          console.log(`Rerun the script to reinstall ${serviceItem.name}.`);
          process.exit(0);
        } else {
          process.exit(0);
        }
      } else {
        console.log('Exiting...');
        process.exit(0);
      }
    } else {
      const dirname = utils.getCurrentExecutionPath();
      utils.verifyInstallationDir(dirname, name);
      utils.runTest();
      if (rls.keyInYN(`Do you want to install ${name} to IAP?`)) {
        console.log('Creating database entries...');
        const adapter = utils.createAdapter(pronghornProps, profileItem, sampleProperties, adapterPronghorn);
        adapter.properties.properties = await addAuthInfo(adapter.properties.properties);

        await database.collection(utils.SERVICE_CONFIGS_COLLECTION).insertOne(adapter);
        profileItem.services.push(adapter.name);
        const update = { $set: { services: profileItem.services } };
        await database.collection(utils.IAP_PROFILES_COLLECTION).updateOne({ id: pronghornProps.id }, update);
        console.log('Database entry creation complete.');
      }
      console.log('Exiting...');
      process.exit(0);
    }
  } else if (['healthcheck', 'basicget', 'connectivity', 'troubleshoot'].includes(command)) {
    await executeCommandOnInstance(command);
  }
};

const main = async (command) => {
  if (!utils.areWeUnderIAPinstallationDirectory()) {
    executeInStandaloneMode(command); // configuration from sampleproperties.json
  } else {
    executeUnderIAPInstallationDirectory(command); // configuration from $IAP_HOME/properties.json
  }
};

program
  .command('connectivity')
  .alias('c')
  .description('networking diagnostics')
  .action(() => {
    main('connectivity');
  });

program
  .command('install')
  .alias('i')
  .description('install current adapter')
  .action(() => {
    main('install');
  });

program
  .command('healthcheck')
  .alias('hc')
  .description('perfom none interative healthcheck with current setting')
  .action(() => {
    main('healthcheck');
  });

program
  .command('basicget')
  .alias('bg')
  .description('perfom basicget')
  .action(() => {
    main('basicget');
  });

program
  .command('troubleshoot')
  .alias('tb')
  .description('perfom troubleshooting')
  .action(() => {
    main('troubleshoot');
  });

// Allow commander to parse `process.argv`
program.parse(process.argv);

if (process.argv.length < 3) {
  main();
}
const allowedParams = ['install', 'healthcheck', 'basicget', 'connectivity', 'troubleshoot'];
if (process.argv.length === 3 && !allowedParams.includes(process.argv[2])) {
  console.log(`unknown parameter ${process.argv[2]}`);
  console.log('try `node troubleshootingAdapter.js -h` to see allowed parameters. Exiting...');
  process.exit(0);
}
