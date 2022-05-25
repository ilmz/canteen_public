const admin =  require('firebase-admin');
const serviceAccount  = require('./illuminz-canteen-app-firebase-adminsdk-lde1s-a53f7bd6e6.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

module.exports = {admin}