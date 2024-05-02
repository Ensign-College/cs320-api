import express from 'express'
import redis from 'redis'

const app = express()


const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379
});
redisClient.connect()



app.get('/', function (req, res) {
  res.send('Hello World')
})

app.post('/shoes', function (req, res) {
  console.log('POST /shoes')
  const shoe = {
      'id': 1234,
      'name': 'My sick red adidas',
      'color': 'red',
    }
  redisClient.set('shoe', JSON.stringify(shoe))
  res.send(shoe)
})

app.get('/shoes', async function(req, res) {
  console.log('GET /shoes')
  let shoes = await redisClient.get('shoe')
  console.log(shoes)
  res.json(shoes)
})

app.listen(3000)