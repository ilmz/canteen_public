// import mongoInitialize from './mongolib';
// import mysqlInitialize from './mysqllib'
const mongoInitialize = require('./mongolib');

export async function initialize (){
    await mongoInitialize();
    // await mysqlInitialize();
}