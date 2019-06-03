/* eslint-disable no-console */
const ZooKeeper = require('zookeeper');

const host = process.argv[2] || '127.0.0.1:2181';

function connectClient() {
  let client = new ZooKeeper();
  let timeoutId;

  client.on('connect', () => {
    console.log('connect', `id=${client.client_id} state=${client.state}`);
    client.aw_exists('/', (...args) => console.log(...args), (...args) => console.log(...args));
    clearTimeout(timeoutId);
  });

  client.on('connecting', () => {
    console.error('\x1b[36m', 'connecting', `id=${client.client_id} state=${client.state}`, '\x1b[0m');

    timeoutId = setTimeout(() => {
      client.close();
    }, 25000);
  });

  client.on('close', () => {
    console.error('\x1b[36m', 'close', `id=${client.client_id} state=${client.state}`, '\x1b[0m');

    client.removeAllListeners('connect');
    client.removeAllListeners('connecting');
    client.removeAllListeners('close');
    client = null;

    connectClient();
  });

  client.init({
    connect: host,
    timeout: 10000,
    debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,
    host_order_deterministic: false,
  });
}

connectClient();
