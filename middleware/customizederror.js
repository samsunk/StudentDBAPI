const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  console.log(err);

  let error = { ...err }; // spread operator and we are creating copy of err

  error.message = err.message;

  //Mongoose bad ObjectID
  if (err.name === "CastError") {
    // const message = `Resource not found with id :  ${err.value}`;
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404);
  }

  //Mongoose Duplicate Key error
  if (err.code === 11000) {
    const message = `Name : ${err.keyValue.name} cannot be duplicate`;
    error = new ErrorResponse(message, 400); // 400 because its a bad request from client
  }

  // Mongoose validation error , i.e when the fields are empty
  if (err.name === "ValidationError") {
    // err.erros have multiple object values so we have to extract only message
    const message = Object.values(err.errors).map((val) => val.message); // val.message will trigger required field in model class
    error = new ErrorResponse(message, 400);
  }

  // using class errorResponse from util folder
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server error",
  });
};

module.exports = errorHandler;
