const keys = require("../keys"),
  redis = require("redis");

// Redis client setup
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  // if we loose connection, the client will attempt to reconnect to the server once each 1 second
  retry_strategy: () => 1000
});

//  according to the redis documentation we can't use a client to manipulate the database and to listen for events
//  to listen to events we have to duplicate the connection
const redisPublisher = redisClient.duplicate();

module.exports = {
  redisClient: redisClient,
  redisPublisher: redisPublisher
};
