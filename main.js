import cors from 'cors'
import express from 'express'
import redis from 'redis'

const app = express()

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const redisClient = redis.createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`
});
redisClient.connect()

var corsOptions = {
  origin: 'http://localhost:3000'
}

app.use(cors(corsOptions))
app.use(express.json())


app.get('/', (req, res) => {
  res.send('Hello World')
})

app.post('/shoes', async (req, res) => {
  console.log('POST /shoes')

  let shoe = req.body
  try {
    shoe.id = parseInt(await redisClient.json.arrLen('shoes','$.list'))+1
  } catch(e) {
    shoe.id = 1
  }
  console.log(shoe)

  await redisClient.json.arrAppend('shoes','$.list', shoe)
  res.json(shoe)
})

app.get('/shoes', async (req, res) => {
  console.log('GET /shoes')
  let shoes = await redisClient.json.get('shoes',{path:'$.list'})
  console.log(shoes)
  res.json(shoes[0])
})

app.get('/shoes/:id', async (req, res) => {
  let shoeId = Number(req.params.id)
  let shoes = await redisClient.json.get('shoes', {path: `$.list[?(@.id==${shoeId})]`})
  console.log(shoes)
  res.send(shoes[0])
})

app.get('/search', async (req, res) => {
  let query = req.query
  let jsonQueryString = '$.list[?('
  Object.keys(query).forEach(key => {
    jsonQueryString += `@.${key}=~"(?i)${query[key]}"` 
  })
  jsonQueryString += ')]'
  let shoes = await redisClient.json.get('shoes', {path: jsonQueryString})
  res.send(shoes)
})

app.listen(3001)