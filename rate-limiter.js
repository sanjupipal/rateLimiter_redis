const redisClient = require("./redis").Client;

function rateLimiter({ secondsWindow = 60, allowedHits = 20 }) {
  return async function (req, res, next) {
    const ip = req.socket.remoteAddress;
    const request = await redisClient.incr(ip);

    if (request == 1) {
      await redisClient.expire(ip, secondsWindow);
    }
    let ttl = await redisClient.ttl(ip);

    if (request > allowedHits) {
      return res.status(503).json({
        response: "cooling down",
        callsInMinute: request,
        ttl,
      });
    }
    req.request = request;
    req.ttl = ttl;
    return next();
  };
}

function slidingWindow({ timeWindowSec, windowSize }) {
  return async function (req, res, next) {
    const uid = req.socket.remoteAddress;
    let current_time = new Date().getTime() / 1000;
    let reference_time = new Date().getTime() / 1000 - timeWindowSec;
    let resPro = await Promise.all([
      redisClient.zRemRangeByScore(uid, 1, reference_time),
      redisClient.zAdd(uid, current_time),
      redisClient.zCard(uid),
      redisClient.expire(uid, 10),
    ]);
    if (resPro[2] > windowSize) {
      return res.status(503).json({
        response: "cooling down",
        callsInMinute: request,
        ttl,
      });
    }
    return next();
  };
}

module.exports = { rateLimiter, slidingWindow };
