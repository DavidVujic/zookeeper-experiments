const { createClient, ZooKeeper } = require('./helper.js');
const logger = require('./logger.js');

function onData(client, rc, error, stat, data) {
  if (data && data.toString() === client.client_id) {
    logger.log('leader');
  }
}

function watcher(client, path, checkFunc, retryFunc, rc) {
  if (rc === -1) {
    checkFunc(client, path, retryFunc);
  } else if (rc === 2) {
    retryFunc(client, path);
  }
}

function checkMaster(client, path, retryFunc) {
  const watchFunc = watcher.bind(null, client, path, checkMaster, retryFunc);

  client.aw_get(path, watchFunc, onData.bind(null, client));
}

function runForLeader(client, path) {
  client.a_create(path, `${client.client_id}`, ZooKeeper.ZOO_EPHEMERAL, (rc) => {
    if (rc === 0) {
      logger.log('leader');
    } else {
      checkMaster(client, path, runForLeader);
    }
  });
}

function electLeader(path) {
  const client = createClient();

  client.on('connect', () => {
    logger.log('connect');
    logger.log(`session established, id=${client.client_id}`);
    runForLeader(client, path);
  });

  client.connect(() => {
  });
}

module.exports = {
  electLeader,
};
