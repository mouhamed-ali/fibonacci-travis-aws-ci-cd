const express = require("express"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
  pgClient = require("./config/pg"),
  redisInstance = require("./config/redis");

// create the express app
const app = express();
//  cross origin resource sharing : https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
//  using the cors will allow us to make requests from our react app to the express app (are not on same domain : specifically not the same port)
app.use(cors());
//  the body parser is used to convert the incoming requests to a json object so the express library can work with
app.use(bodyParser.json());

// express route handlers
app.get("/", (req, res) => {
  res.send({
    status: "up"
  });
});

// return all indexes stored in the postgres database
app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("SELECT * from values");
  res.send(values.rows);
});

//  return all values from redis
app.get("/values/current", async (req, res) => {
  // as we can see the redis library does not support promises
  redisInstance.redisClient.hgetall("values", (err, values) => {
    res.send(values);
  });
});

//  calculate a fibonnaci sequence
app.post("/values", async (req, res) => {
  const index = req.body.index;
  console.log(`receiving a new index : ${index}`);

  if (parseInt(index) > 50) {
    return res.send(422).send("Index too high");
  }

  // we will store the index with a default value so that the worker can calculate the sequence and replace the default value
  redisInstance.redisClient.hset("values", index, "Nothing yet");

  // now we will publish a new event to redis so the worker can intercept it and start the calculation
  redisInstance.redisPublisher.publish("insert", index);
  console.log(`The insert event was published for the index : ${index}`);

  // now we will add the index to the postgres database
  pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

  res.send({ working: true });
});

app.listen(5000, () => {
  console.log("Listening on port 5000");
});
