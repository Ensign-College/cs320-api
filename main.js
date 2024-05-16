import cors from 'cors'
import express from 'express'
import redis from 'redis'

const app = express()


const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379
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
    shoe.id = parseInt(await redisClient.json.arrLen('shoes','$'))+1
  } catch(e) {
    shoe.id = 1
  }
  console.log(shoe)

  await redisClient.json.arrAppend('shoes','$', shoe)
  res.json(shoe)
})

app.get('/shoes', async (req, res) => {
  console.log('GET /shoes')
  let shoes = await redisClient.json.get('shoes',{path:'$'})
  console.log(shoes)
  res.json(shoes[0])
})

app.get('/shoes/:id', async (req, res) => {
  let shoeId = Number(req.params.id)
  let shoes = await redisClient.json.get('shoes', {path: `$`})
  let shoe = shoes[0].find(({id}) => id === shoeId)
  res.send(shoe)
})

app.listen(3001)