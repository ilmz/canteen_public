const { configure, getLogger } = require('log4js')
const { environment }= require('./environment') 

configure({
  appenders: {
    console: {
      type: 'stdout', layout: {
        type: 'pattern',
        pattern: '%d %[%p%] %m'
      }
    },
    dateFile: {
      type      : 'dateFile',
      filename  : `${environment.logDir}/${environment.logFile}`,
      layout    : { type: 'basic' },
      compress  : true,
      keepFileExt: true
    }
  },
  categories: {
    default: { appenders: ['console','dateFile'], level: environment.logLevel }
  }
});
exports.logger =  getLogger()
exports.fileLogger =  getLogger('dateFile')


// fetch logger and export
// module.export = logger