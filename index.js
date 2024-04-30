const express = require('express');
const app = express();

// Objects
const Air = {
    name: 'Nike Air Max 90',
    price: 100
};

const Jordan = {
    name: 'Nike Air Jordan 1',
    price: 150
};

const Adidas = {
    name: 'Adidas Superstar',
    price: 80
};

const shoes = [Air, Jordan, Adidas];
const jsonShoes = JSON.stringify(shoes);

app.get('/', (req, res) => {
    res.send(jsonShoes);
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});