// const bodyParser = require('body-parser');
const path                      = require('path');
const express                   = require('express');
const morgan                    = require('morgan');
const rateLimit                 = require('express-rate-limit');
const helmet                    = require('helmet');
const swaggerUI                 = require('swagger-ui-express')
const mongoSanitize             = require('express-mongo-sanitize');
const xss                       = require('xss-clean');
const compression               = require('compression');
const cors                      = require('cors');
const v1                        = require('./V1/routes/index');
const { sendCustomResponse }    = require('./responses/responses')
const { responseMessageCode }   = require('./responses/messageCodes');
const { getResponseMessage }    = require('./language/multilanguageController');
const { BadRequest }            = require('./constants/constants');
const { logger }                = require('./logger/logger');
const swaggerDocument           = require('./swagger/swagger.json');
const app                       = express();

/**
 * @desc Development logging
 */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
/**
 * @desc Limit request from same API
 */
 const limiter = rateLimit({
  max     : 500,
  windowMs: 60 * 60 * 1000,
  message : 'To many request from this IP, please try again later',
});

app.use(cors());          //only work for simple request get and post for non simple request we have to use option
app.options('*', cors()); //every non simple request
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());
app.use(compression());
app.use(mongoSanitize());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,authtoken");
  next();
});
app.use('/api', limiter);
app.use("/uploads", express.static(path.join(__dirname, `uploads`)));



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

/**
 * @desc Routes
 */
app.use('/api/v1', v1);

/**swagger*/
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument, {
  swaggerOptions: {
    apisSorter      : 'alpha',
    tagsSorter      : 'alpha',
    operationsSorter: 'alpha',
  }
}));

/**ERROR HANDLER */
// app.use((req, res, next) => {
//   const error = new Error('Not Found');
//   error.status = 404;
//   next(error);
// })
app.use((err, _, res, next) => {
  let response = {
    status  : err.status || 500,
    message : err.message || 'Internal Server Error',
    data    : {},
  }
  res.status(err.status || 500).json(response);
  logger.error(JSON.stringify({ EVENT: "FINAL RESPONSE", ERROR: response }));
})
app.all('*', (req, res, next) => {
  return sendCustomResponse(res, getResponseMessage(responseMessageCode.CANT_FIND_URL,  'en').replace('<URL>', req.originalUrl ), BadRequest.NotFound);
});
global.app = app;
