const redis = require('redis');
const REDIS_HOST = "127.0.0.1";
const REDIS_PORT = 6379;

const redisClient = redis.createClient({

    host: REDIS_HOST,
    port: REDIS_PORT
});
redisClient.connect();


redisClient.on('error', function(err) {
    console.error('Error connecting to Redis', err);
});



class Shoe {
    constructor(shoeId, model, color, size) {
        this.shoeId = shoeId;
        this.model = model;
        this.color = color;
        this.size = size;
    }
}

let shoeOne = new Shoe('1', "Nike dunk", "Black", 9);
let shoeTwo = new Shoe('2', "Adidas yeezy", "TripleWhite", 8);

let shoes =[shoeOne,shoeTwo];

/*

shoes.forEach(shoe => {
    redisClient.set(`shoe:${shoe.shoeId}`, JSON.stringify(shoe), function(err, reply) {
        if (err) {
            console.error('Error:', err);
        } else {
            console.info('Reply:', reply);
        }
    });
});

*/



const setRedisValue = (key, value) => {
    return new Promise((resolve, reject) => {
        redisClient.set(key, JSON.stringify(value), function(err, reply) {
            if(err) return reject(err);
            resolve(reply);
        });
    });
};

shoes.forEach(shoe => {
    setRedisValue(`shoe:${shoe.shoeId}`, shoe)
        .then(reply => console.info('Reply:', reply))
        .catch(err => console.error('Error:', err));
});

/*
redisClient.flushdb( function (err, succeeded) {
    console.log(succeeded); // will be true if successfull
});



*/