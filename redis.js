const Redis = require("redis");
  url = 'redis://root:252sanju@127.0.0.1:6380';
let Client = Redis.createClient(url);

Client.connect()

Client.on("connect", function () {
  console.log("Redis Sever Connected");
});
Client.on("disconnect", function () {
  console.log("disconnected");
});
Client.on("error", function (err) {
  console.log("redis error", err);
});
Client.on("end", function () {
  console.log("redis end");
});

module.exports.Client = Client;