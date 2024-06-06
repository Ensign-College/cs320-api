const express = require('express')

const cors = require('cors')

const redisClient = require('./redisClient')

const {response} = require("express");

const app = express();

app.use(cors());
//
//Refactor the Get Shoes Endpoint to Handle Errors & Return Result to Client
app.get('/shoes', async (request, response) => {
    try {
        console.log(await redisClient.keys('shoe:*'))
        const shoeIds = await redisClient.keys('shoe:*')
        const shoes = await Promise.all(shoeIds.map(async(id)=>{
           const item = await redisClient.get(id)
            return JSON.parse(item)
        }))
        response.send(shoes);
    }catch(err) {
        console.error(err);
        response.status(500).send('Server Error');
    }
});

app.get('/shoes/:id', async (request, response) => {
    try{
        const id = `shoe:${request.params.id}`;
        const item = await redisClient.get(id)
        if (!item){
            throw new Error('shoe not found')
        }
        response.send(JSON.parse(item))
    }catch(err){
        console.error(err);
        response.status(500).send(err.message);
    }
})

// app.post('/shoes', (request, response) => {
//     redisClient.set('shoeCollection','red adidas')
//     response.send('Shoes added!')
// })


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})

