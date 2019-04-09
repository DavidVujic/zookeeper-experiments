const { electLeader } = require('./electleader.js');
const { createNodes } = require('./setup.js');

const logger = require('./logger.js');
const notifier = require('./notifier.js');

notifier.on('connect', message => logger.log('connect', message));
notifier.on('leader', message => logger.log('leader', message));
notifier.on('createNode', message => logger.log('createNode', message));

createNodes(['/workers', '/assign', '/tasks', '/status'], () => {
  logger.log('create nodes done');
  electLeader('/master');
});
