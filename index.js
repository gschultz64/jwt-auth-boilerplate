require('dotenv').config();
const express = require('express');
const bp = require('body-parser');
const mongoose = require('mongoose');
const expressJWT = require('express-jwt');
const auth = require('./routes/auth');
const locked = require('./routes/locked');

const app = express();
// This line lets us accept POST data from axios
app.use(bp.json());
app.use(bp.urlencoded({ extended: false }));

mongoose.connect('mongodb://localhost/jwtAuth');

// Where React app will look for "stuff"
app.use(express.static(__dirname + "/client/build"));

app.use('/auth', auth);
// Lock down a route(s) with express-jwt
app.use('/locked', expressJWT({
  secret: process.env.JWT_SECRET
}).unless({ method: 'POST' }), locked);

// To build react app and deliver from back-end
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/client/build/index.html')
});

// Using Proxy Method (add proxy line to client package.json)
var port = process.env.PORT || 3000;

var server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = server;