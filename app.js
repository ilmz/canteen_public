const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const swaggerUI = require('swagger-ui-express')


const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
// const bodyParser = require('body-parser');

const compression = require('compression');
const cors = require('cors');

const app = express();

const v1 = require('./V1/routes/index');

const {logger} = require('./logger/logger')




//Set Security HTTP headers
//Implementing CORS
app.use(cors()); //only work for simple request get and post for non simple request we have to use option


app.options('*', cors()); //every non simple request


app.use(helmet());


//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'To many request from this IP, please try again later',
});
app.use('/api', limiter);



//Body Parser,  reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

//Data sanitization against NOSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

app.use(compression());


/**swagger*/
const swaggerDocument = require('./swagger/swagger.json');
app.use("/canteen-doc", swaggerUI.serve, swaggerUI.setup(swaggerDocument, {
  swaggerOptions: {
    apisSorter: 'alpha',
    tagsSorter: 'alpha',
    operationsSorter: 'alpha',
  }}));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,authtoken");
  next();
});

app.use((req, _, next) => {
  let log = {
    method: req.method   || "GET",
    path: req.pathname   || req.path || "/",
    body: req.body       || {},
    params: req.params   || {},
    query: req.query     || {},
    headers: req.headers || {}
  };
  logger.info(JSON.stringify({ EVENt: "REQUEST", logs: log }))
  next();
});

//3.Routes
app.use('/api/v1', v1);

/**ERROR HANDLER */
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
})
app.use((err, _, res, next) => {
  let response = {
    status: err.status || 500,
    message: err.message || 'Internal Server Error',
    data: {},
  }
  console.log("err:", err);
  res.status(err.status).json(response);
  logger.error(JSON.stringify({ EVENT: "FINAL RESPONSE", ERROR: response }));
})



module.exports = app;