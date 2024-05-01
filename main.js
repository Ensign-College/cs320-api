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

app.post('/boxes', function (req, res) {
  console.log('POST /boxes')
  const box = {
      'id': 1234,
      'name': 'box1',
      'color': 'red',
    }
  redisClient.set('box', JSON.stringify(box))
  res.send(box)
})

app.get('/boxes', async function(req, res) {
  console.log('GET /boxes')
  let boxes = await redisClient.get('box')
  console.log(boxes)
  res.json(boxes)
})

app.listen(3000)