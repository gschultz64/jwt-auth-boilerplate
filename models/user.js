const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// This makes a new schema for a collection with validations
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'You must enter a name'],
    minlength: [1, 'Name must be between 1 and 99 characters'],
    maxlength: [99, 'Name must be between 1 and 99 characters'],
  },
  password: {
    type: String,
    require: [true, 'You must enter a password'],
    minlength: [8, 'Name must be between 8 and 99 characters'],
    maxlength: [99, 'Name must be between 1 and 99 characters'],
  },
  email: {
    type: String,
    require: [true, 'You must enter a name'],
    minlength: [5, 'Email must be between 5 and 99 characters'],
    maxlength: [99, 'Email must be between 5 and 99 characters'],
  }
});

// This returns a user object without a password
userSchema.set('toObject', {
  transform: function(doc, ret, options) {
    let returnJson = {
      _id: ret._id,
      email: ret.email,
      name: ret.name
    }
    return returnJson;
  }
});

// This checks the entered password against the hashed password
userSchema.methods.authenticated = function(password) {
  return bcrypt.compareSync(password, this.password);
};

// 
userSchema.pre('save', function(next) {
  if (this.isNew) {
    let hash = bcrypt.hashSync(this.password, 12)
    this.password = hash;
  }
  next();
});

// Make a new model from that schema
const User = mongoose.model('User', userSchema);

module.exports = User;