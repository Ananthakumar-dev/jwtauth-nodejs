const rateLimit = require('express-rate-limit')
const { createClient } = require('redis')

const redisClient = createClient();

redisClient.on('error', (err) => {
    //console.error('Redis Client Error', err);
});

(async () => {
    await redisClient.connect();
})()

const createRateLimiterUsingRedis = (maxRequests, windowMs) => {
    return rateLimit({
        max: maxRequests,
        windowMs,
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: (req) => {
            return req.user?.id || req.ip;
        },
        store: {
            incr: async (key, cb) => {
                console.log(key, redisClient)

                try {
                    const current = await redisClient.incr(key);

                    console.log(current)
                    if(current === 1) {
                        await redisClient.expire(key, windowMs / 1000)
                    }

                    cb(null, current);
                } catch(error) {
                    cb(error);
                }
            },
            resetKey: async (key) => {
                try {
                    console.log(key)
                    await redisClient.del(key)
                } catch(err) {
                    throw new Error(err.message || 'Something went wrong')
                }
            }
        },
        handler: (req, res) => {
            res.status(429).json({
                status: false,
                message: 'Too many requests'
            });
        }
    });
}

const createRateLimiter = (maxRequests, windowMs) => {
    return rateLimit({
        windowMs: windowMs, // 10 minutes
        max: maxRequests, // Limit each user to 20 requests per windowMs
        keyGenerator: (req) => req.user?.id || req.ip, // Use user ID if available; fallback to IP
        message: 'Too many requests from this user, please try again later.',
    });
}

module.exports = createRateLimiter;