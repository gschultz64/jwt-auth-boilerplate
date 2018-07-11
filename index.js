require('dotenv').config();
const express = require('express');
const bp = require('body-parser');
const mongoose = require('mongoose');
const expressJWT = require('express-jwt');

const app = express();
// This line lets us accept POST data from axios
app.use(bp.json());
app.use(bp.urlencoded({extended: false}));

// Where React app will look for "stuff"
app.use(express.static(__dirname + "/client/build"));

// Using Proxy Method
var port = process.env.PORT || 3001;

var server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = server;