const { createClient } = require('./wrapper.js');
const notifier = require('./notifier.js');

const noop = () => {};
const persistentNode = 0;

function createNode(client, path, done) {
  client.a_create(path, '', persistentNode, (rc) => {
    if (rc === -110) {
      done(`${path} already exists`);
    } else {
      done(`(${path}) result code: ${rc}`);
    }
  });
}

function createNodes(paths, done = noop) {
  const client = createClient();

  client.on('connect', () => {
    notifier.emit('connect', `session established, id=${client.client_id}`);

    paths.forEach((path, index) => {
      createNode(client, path, (message) => {
        notifier.emit('createNode', message);

        if (paths.length === (index + 1)) {
          done();
        }
      });
    });
  });

  client.connect(noop);
}

module.exports = {
  createNodes,
};
