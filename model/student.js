const mongoose = require("mongoose");

const Student = new mongoose.Schema(
    {
        fullname:{
            type: String,
            required: [true,"Enter full name"],
            trim: true
        },
        age:{
            type: Number,
            required: [true,"Enter age"],
        },
        gender:{
            type: String,
            required: [true,"Select Gender"],
            trim: true
        },
        address:{
            type: String,
            required: [true,"Enter address"],
            trim: true
        },
        photo: {
            type: String,
            default: "no-photo.jpg",
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
    }
);

module.exports = mongoose.model("Student",Student);
