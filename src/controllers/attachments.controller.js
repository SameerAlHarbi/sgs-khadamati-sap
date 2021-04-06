const multer = require('multer');
const fs = require('fs');


exports.attach = async (req, res, next) => {

    try {

        // const buffer = req.file.buffer.toString('base64');
        const hexBinaryData = req.file.buffer.toString('hex');
        const arr = hexBinaryData.match(/.{1,255}/g);

        res.json({ results : 'ok'});

    } catch(error) {
        error.httpStatusCode = error.httpStatusCode || 500;
        return next(error);
    }

};