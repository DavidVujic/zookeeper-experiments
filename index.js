const { createNodes } = require('./setup.js');
const { electLeader } = require('./electleader.js');
const { createWorker } = require('./createWorker.js');

const logger = require('./logger.js');
const notifier = require('./notifier.js');

notifier.on('connect', message => logger.log('connect', message));
notifier.on('leader', message => logger.log('leader', message));
notifier.on('createNode', message => logger.log('createNode', message));
notifier.on('createWorker', message => logger.log('createWorker', message));

async function init() {
  await createNodes(['/workers', '/assign', '/tasks', '/status']);
  logger.log('create nodes done');
  electLeader('/master');
  createWorker();
}

init().catch(logger.error);
