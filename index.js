const { electLeader } = require('./electleader.js');
const logger = require('./logger.js');
const notifier = require('./notifier.js');

notifier.on('connect', message => logger.log('connect', message));
notifier.on('leader', message => logger.log('leader', message));

electLeader('/master');
