const { createClient, ZooKeeper } = require('./wrapper.js');
const notifier = require('./notifier.js');

const noop = () => {};

function createNode(client, name, done) {
  client.a_create(name, '', ZooKeeper.ZOO_EPHEMERAL | ZooKeeper.ZOO_SEQUENCE, (rc, error, path) => {
    done(`(${path}) result code: ${rc}`);
  });
}

function createWorker() {
  const client = createClient();

  client.on('connect', () => {
    notifier.emit('connect', `session established, id=${client.client_id}`);

    createNode(client, '/workers/worker-', (message) => {
      notifier.emit('createWorker', message);
    });
  });

  client.connect(noop);
}

module.exports = {
  createWorker,
};
