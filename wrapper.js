const ZooKeeper = require('zookeeper');

/** @returns {ZooKeeper} */
function createClient(timeoutMs = 5000) {
  const config = {
    connect: '127.0.0.1:2181',
    timeout: timeoutMs,
    debug_level: ZooKeeper.ZOO_LOG_LEVEL_WARN,
    host_order_deterministic: false,
  };

  return new ZooKeeper(config);
}

module.exports = {
  createClient,
  ZooKeeper,
};
