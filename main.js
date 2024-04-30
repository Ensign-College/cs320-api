import express from 'express'

const app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('/boxes', function (req, res) {
  console.log('/boxes')
  const boxes = [
    {
      'id': 1234,
      'name': 'box1',
      'color': 'red',
    },
    {
      'id': 1235,
      'name': 'box2',
      'color': 'blue',
    },
    {
      'id': 1236,
      'name': 'box3',
      'color': 'black',
    },
    {
      'id': 1237,
      'name': 'box4',
      'color': 'green',
    },
  ]
  res.send(boxes)
})

app.listen(3000)