/* eslint-disable no-console */
require('./app');
const mongoose = require('mongoose');
const http     = require('http');

const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION !!! ');
  console.log("error:", err)
  console.log(err.name, err.message);
  process.exit(1);
});


//4. start server
//console.log(process.env);

const DB = process.env.DATABASE_HOST.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
const MongoUrl = process.env.MONGO_URI

mongoose
  .connect(
    MongoUrl, {
    user: process.env.DATABASE_USERNAME,
    pass: process.env.DATABASE_PASSWORD,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection is successful'));


const port = process.env.PORT || 3000;
mongoose.set('debug', true)

// const server = app.listen(port, () => {
//   // eslint-disable-next-line no-console
//   console.log(`App is running on ${port}...`);
// });

let serverAdd = process.env.NODE_ENV == 'development' ? 'localhost' :  process.env.NODE_HOST;
const server = http.createServer(app).listen(port, serverAdd, () => {
    // eslint-disable-next-line no-console
    console.log(`App is running on ${port}...`);
  } )


process.on('unhandledRejection', (err) => {
  console.log("error:", err);
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION !!! Shutting down....');
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('Process Terminated !');
  });
});