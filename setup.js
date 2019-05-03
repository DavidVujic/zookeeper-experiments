const { createClient } = require('./wrapper.js');
const notifier = require('./notifier.js');

const noop = () => {};
const persistentNode = 0;

function createNode(client, path) {
  return new Promise((resolve) => {
    client.a_create(path, '', persistentNode, (rc) => {
      if (rc === -110) {
        resolve(`${path} already exists`);
      } else {
        resolve(`(${path}) result code: ${rc}`);
      }
    });
  });
}

function createNodes(paths) {
  const client = createClient();
  return new Promise((resolve) => {
    client.on('connect', () => {
      notifier.emit('connect', `session established, id=${client.client_id}`);

      paths
        .forEach((path, index) => {
          createNode(client, path)
            .then((message) => {
              notifier.emit('createNode', message);

              if (paths.length === (index + 1)) {
                resolve();
              }
            });
        });
    });

    client.connect(noop);
  });
}

module.exports = {
  createNodes,
};
