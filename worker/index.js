const keys = require("./keys"),
  redis = require("redis"),
  fib = require("./fibonnaci");

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  // if we loose connection, the client will attempt to reconnect to the server once each 1 second
  retry_strategy: () => 1000
});

const sub = redisClient.duplicate();

/*
 *   every time we get a new value shows up in redis we gonna to calculate a new fibonnaci value
 *   and insert that in a hash called values : the key will be the index (the received message) and the value
 *   will the calculated fibonnaci sequence
 */
sub.on("message", (channel, message) => {
  redisClient.hset("values", message, fib(parseInt(message)));
});

//  subscribe to any insert event, any time anybody inserts a new value (an index) we gonna calculate its fibonnaci sequence
sub.subscribe("insert");
