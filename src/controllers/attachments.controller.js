const multer = require('multer');
const attachmentsManager = require('../managers/attachments.manager');

exports.attach = async (req, res, next) => {

    const { employeeId
          , fromDate
          , toDate
          , sequence
          , requestNumber
          , requestDate } = req.body;

    const attachedFile = req.file;

    try {

        const result = await attachmentsManager.attach(employeeId
            , fromDate
            , toDate
            , sequence
            , requestNumber
            , attachedFile
            , requestDate);

        res.json({ results : 'ok'});

    } catch(error) {
        error.httpStatusCode = error.httpStatusCode || 500;
        return next(error);
    }

};