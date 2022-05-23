const mongoose = require('mongoose')
const validator = require('validator');
// import { genSaltSync, hashSync, compareSync } from 'bcrypt';
const {genSaltSync, hashSync, compareSync, hash, compare }  = require('bcrypt')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'], //validater
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'], //validater
    lowercase: true,
    validate: [validator.isEmail, 'please provide a valid Email'],
  },
  social_login_id: {
    type: String,
    required: [false, 'A user must have a social login'],

  },
  social_type: {
    type: String,

  },
  isSocial: {
    type: Boolean,
    default: false,
  },
  Amount: {
    type: Number,
    required: [false, 'user item must have a price.']
  },
  status: {
    type: Boolean,
    default: true,
    select: false,
  },
  password: {
    type: String,
    required: [false, 'A user must have a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [false, 'A user must confirm password'],
    validate: {
      //This only works on . create and save
      validator: function (el) {
        return el === this.password;
      },
    },
  },
  passwordChangedAt: Date,
  role: {
    type: Number,
    default: 1,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
},
 {
  timestamps: true,
 } 
);

userSchema.pre('save', async function (next) {
  //Only run this function if password is modified
  if (!this.isModified('password')) return next();

  //Hash the password at the cost of 12
  this.password = await hash(this.password, 12);

  //delete passwordConfirm from the database
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;