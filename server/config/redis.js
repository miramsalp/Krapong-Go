const redis = require('redis');

const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

console.log(`Connecting to Redis at ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);

redisClient.on('error', err => console.log('Redis Client Error:', err));
redisClient.on('connect', () => console.log('Connected to Redis successfully!'));

(async () => {
    await redisClient.connect();
})();

module.exports = redisClient;