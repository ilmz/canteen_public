const multer = require('multer');
const {sendCustomResponse} = require('../../responses/responses')
const { responseMessageCode }= require('../../responses/messageCodes') ;
const { getResponseMessage }= require('../../language/multilanguageController') ;
const { logger } = require('../../logger/logger');
const { Success, BadRequest, role, serverError  }  = require('../../constants/constants') ;

const path = require('path');


const documentUpload = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(null, path.join(__dirname, '/uploads'));
        const dir = `http://${process.env.NODE_SERVER_HOST}/uploads/item/image`;
        // console.log("dir:", dir);
        cb(null, dir)
    },
    filename: function (req, file, cb) {
        let path = 'image' + '-' + Date.now() + `.${file.originalname.split('.').pop()}`
        cb(null, path)
    }
});


const photoUpload = multer({ storage: documentUpload });

exports.uploadUserPhoto = photoUpload.single('photo');



// module.exports = {photoUpload}