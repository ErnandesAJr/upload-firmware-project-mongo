const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');


const storageTypes = {
    local: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null,path.resolve(__dirname, "..", "..","tmp","uploads"))
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) =>{
                if(err) cb(err);

                file.key  = `${hash.toString('hex')}-${file.originalname}`
                
                cb(null, file.key)
            })
        }
    }),
    s3: multerS3({
        s3: new aws.S3(),
        bucket:process.env.AWS_BUCKET_NAME,
        /**
         * Obriga baixar ! Não colocar isso , pois força o donwload! Mas por enquanto não
         */
        contentType: multerS3.DEFAULT_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) =>{
                if(err) cb(err);

                const fileName = `${hash.toString('hex')}-${file.originalname}`
                
                cb(null, fileName)
            })
        }
    })
}

module.exports = {
    dest:path.resolve(__dirname, "..", "..","tmp","uploads"),
    storage: storageTypes[process.env.STORAGE_TYPE],
    limits:{
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        var ext = path.extname(file.originalname);

        if(ext === '.bin') {
            return cb(null, true);
        }
        
        return cb(new Error("Invalid file type"))
    }
}