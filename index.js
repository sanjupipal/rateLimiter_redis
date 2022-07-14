const express = require('express')
const app = express()
const redisClient = require('./redis').Client;
const {rateLimiter,slidingWindow} = require('./rate-limiter');

app.use(express.json({ limit: "20mb" }));

app.post("/api1",rateLimiter({secondsWindow : 60,allowedHits : 2}), async(req,res)=>{

    return res.json({
        response:"OK",
        callsInMinute:req.request,
        ttl:req.ttl
    })
})

app.post("/api2",slidingWindow({timeWindowSec : 60,windowSize : 2}), async(req,res)=>{

    return res.json({
        response:"OK",
        callsInMinute:req.request,
        ttl:req.ttl
    })
})


app.listen(8000,()=>{
    console.log("server on port 8000");
})