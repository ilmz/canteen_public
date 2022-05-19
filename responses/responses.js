const  {logger} = require('../logger/logger')


function sendCustomResponse(res, message, code, data) {
    let response = {
      status: code || 200,
      message: message,
      data: data || {},
    };
    logger.info(JSON.stringify({ EVENT: "FINAL RESPONSE", RESPONSE: response }));
    res.status(response.status).send(JSON.stringify(response));
  }
  
module.exports = {
    sendCustomResponse
}