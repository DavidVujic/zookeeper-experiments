const { createNodes } = require('./setup.js');
const { electLeader } = require('./electleader.js');
const { createWorker } = require('./createWorker.js');

const logger = require('./logger.js');
const notifier = require('./notifier.js');

notifier.on('connect', message => logger.log('connect', message));
notifier.on('createNode', message => logger.log('createNode', message));

function setupMaster() {
  return new Promise((resolve) => {
    notifier.on('leader', (message) => {
      logger.log('leader', message);
      resolve();
    });

    electLeader('/master');
  });
}

function setupWorker() {
  return new Promise((resolve) => {
    notifier.on('createWorker', (message) => {
      logger.log('createWorker', message);
      resolve();
    });

    createWorker();
  });
}

async function addListener(client, path) {
  logger.log(`TODO: ${client.client_id} should listen to ${path}`);
}

async function addTask() {
  logger.log('TODO: add task');
}

async function init() {
  await createNodes(['/workers', '/assign', '/tasks', '/status']);
  await setupMaster();
  await setupWorker();
  await addListener({ client_id: 'TODO' });
  await addTask();
}

init().catch(logger.error);
