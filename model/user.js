const crypto = require("crypto"); //to generate the token and hash it
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    fname : {
        type : String,
        required : [true,'Enter first name']
    },
    lname : {
        type : String,
        required : [true,'Enter last name']
    },
    username : {
        type: String,
        unique : true,
        trim : true,
        require:[true,'Enter username']
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: 6,
        select: false, // it will not return the password when quering
      },
      createdAt: {
        type: Date,
        default: Date.now,
      }
});

UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  };
  
  //Match user entered password to hashed password in database
  UserSchema.methods.matchPassword = async function (enteredPassword) {
    return  bcrypt.compare(enteredPassword, this.password); 
  };
  
  
  //Generate and hash password token
  UserSchema.methods.getResetPasswordToken = function () {
    //Generate the token
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    //set expire time to 10 minutes
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  
    return resetToken;
  };
  
  module.exports = mongoose.model("User", UserSchema);