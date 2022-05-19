import mongoose from  'mongoose';
import {logger} from '../logger/logger';
import {getFormattedDate, formats} from '../utils/dateUtility'
import config from 'config';

function mongoInitialize (){
  mongoose.connect(config.get('MongoDB.mongo_db_connection'), { useUnifiedTopology: true, useNewUrlParser: true, autoIndex: false},(err, res) =>{
    logger.info("################# STARTING MONGO CONNECTION @ " + getFormattedDate(new Date(), formats.timeWithMilliSeconds + " #############"));
     if(err) {
        logger.error({EVENT : "MONGO_CONN_ERR", ERR : err});
     } else
        logger.info("################# MONGO CONNECTED @ => DATABASE: " +  config.get('MongoDB.database') +" => " + getFormattedDate(new Date(), formats.timeWithMilliSeconds + " #############"));
  })
}
export default mongoInitialize;