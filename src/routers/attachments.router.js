const express = require('express');
const multer = require('multer');
const { queryMiddleware } = require('@abujude/sgs-khadamati');

const attachmentsController = require('../controllers/attachments.controller');

const Router = express.Router();

const upload = multer({
    // dest: 'images',
    limits: {
        fileSize: 2000000
    },
    fileFilter(req, file, cb) {

        if(!file.originalname.endsWith('.pdf')) {
            const error = new Error('Please upload a PDF only!');
            error.httpStatusCode = 400;
            return cb(error);
        }

        cb(undefined, true);
    }
})

// /attachments/attach?{lang=A} => GET
Router.post('/attach'
    , upload.single('upload')
    , queryMiddleware.parseDate(['fromDate', 'toDate', 'requestDate']
        , 'dateFormat', true, false, true)
    , attachmentsController.attach);

module.exports = Router;
