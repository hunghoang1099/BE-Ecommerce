const { createClient } = require('redis');

async function connectRedis() {
  const client = createClient();
  await client.connect();

  client.ping('localhost');

  client.on('connect', () => {
    console.log('Redis client connected');
  });

  client.on('error', (error) => {
    console.error(error);
  });
}

module.exports = {
  connectRedis
};
