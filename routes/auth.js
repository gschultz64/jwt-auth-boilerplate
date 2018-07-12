require('dotenv').config();
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.post('/signup', (req, res) => {
  // See if the email is already in the DB
  User.findOne({email: req.body.email}, (err, user) => {
    if (user) {
      // Alert the user 
      res.status(401).json({
        error: true,
        message: 'Email is already in use'
      });
    } else {
      // If the email is not taken...
      // Create the user in the DB
      User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      }, (err, user) => {
        // Check for any DB errors
        if (err) {
          console.log("We got an error creating the user!");
          console.log(err);
          res.status(401).json({
            error: true,
            message: 'There was an error creating the user!'
          });
        } else {
          // Log the user in (sign a new token)
          console.log("Just about to sign the token.");
          var token = jwt.sign(user.toObject(), process.env.JWT_SECRET, {
            expiresIn: 60 * 60 * 24
          });
          // Return user and token to React app
          res.json({user, token});
        }
      });
    }
  });
});

router.post('/login', (req, res) => {
  // Look up user in the DB
  User.findOne({email: req.body.email}, (err, user) => {
    // If there is a user...
    if (user) {
      // check their entered password against the hash
      // if it matches:
      if (user.authenticated(req.body.password)) {
        //log in the user (sign a new token)
        var token = jwt.sign(user.toObject(), process.env.JWT_SECRET, {
          expiresIn: 60 * 60 * 24
        });
        res.json({user, token});
      } else {
        // if it does not match:
        // send an error
        res.json({
          error: true,
          status: 401,
          message: 'Email or password is incorrect'
        });
      }
    } else {
      // If the user is not in the DB...
      res.json({
        error: true,
        status: 401,
        message: 'Account not found'
      });
    }
  })
});

router.post('/me/from/token', (req, res) => {
  let token = req.body.token;
  // Check for the presence of a token
  if (!token) {
    // They did not send me a token
    res.status(401).json({
      error: true,
      message: 'You must pass a token'
    });
  } else {
    // We do have a token
    // Validate the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      // If token is invalid...
      if (err) {
        // Send error
        res.status(401).json(err);
      } else {
        // If token is valid...
        // Look up the user in the DB
        User.findById(user._id, (err, user) => {
          if (err) {
            res.status(401).json(err);
          } else {
            // Send the user and the token back to the React app 
            res.json({user, token});
          }
        });
      }
    });
  }
});


module.exports = router;