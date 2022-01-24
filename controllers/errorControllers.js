const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid id for ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //opertaional , trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    //programming or other unknown error: dont leak error details
  } else {
    console.error('ERROR', err);
    res.status(404).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'production') {
    console.error('ERROR', err);
    console.log(process.env.NODE_ENV);
    let error;
    if (err.name === 'CastError') {
      error = handleCastErrorDB(err);
    }
    sendErrorProd(error, res);
  } else if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }
};
