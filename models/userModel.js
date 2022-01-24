const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a username'],
  },
  email: {
    type: String,
    required: [true, 'User must have a email'],
    unique: true,
    validate: [validator.isEmail, 'please enter a valid email'],
  },
  photo: String,

  password: {
    type: String,
    required: [true, 'User must have a password'],
    minLength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please Conform your password'],
    validate: {
      // validators are always the boolean function
      //this only works on SAVE and Create
      validator: function (el) {
        return this.password === el;
      },
    },
    message: 'Passwords do not match',
  },
});

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,12);
    //delete the passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
