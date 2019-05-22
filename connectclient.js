/* eslint-disable no-console */
const ZooKeeper = require('zookeeper');

function connectClient() {
  const client = new ZooKeeper();

  client.on('connect', () => {
    console.log('connect', `id=${client.client_id} state=${client.state}`);
    client.aw_exists('/', (...args) => console.log(...args), (...args) => console.log(...args));
  });

  client.on('connecting', () => {
    console.error('\x1b[36m', 'connecting', `id=${client.client_id} state=${client.state}`, '\x1b[0m');
  });

  client.on('close', () => {
    console.error('\x1b[36m', 'close', `id=${client.client_id} state=${client.state}`, '\x1b[0m');
  });

  client.init({
    connect: '127.0.0.1:2181',
    timeout: 10000,
    debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,
    host_order_deterministic: false,
  });
}

connectClient();
