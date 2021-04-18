const { dateUtil } = require('@abujude/sgs-khadamati');
const sapPool = require('../util/sap-rfc');

exports.attach = async ( employeeId
        , fromDate
        , toDate
        , sequence
        , requestNumber
        , attachedFile
        , requestDate = new Date()) => {

    try {

        const buffersArray = [];
        let bufferSize = Buffer.byteLength(attachedFile.buffer);
        let startIndex = 0;
        while(bufferSize > 0) {
            bufferSize -= 255;
            let currentSize = bufferSize > 0 ? 255 : 255 + bufferSize;
            let bufferItem = Buffer.alloc(currentSize);
            attachedFile.buffer.copy(bufferItem, 0, startIndex, startIndex + currentSize + 1);
            startIndex = startIndex + currentSize;
            buffersArray.push(bufferItem);
        }

        const sapClient = await sapPool.acquire();

        const sapParams = { 
            IM_ATTA_KEY: {
                PERNR: employeeId
              , SUBTY: '    '
              , ENDDA: dateUtil.formatDate(toDate,dateUtil.defaultSapCompiledFormat)
              , BEGDA: dateUtil.formatDate(fromDate,dateUtil.defaultSapCompiledFormat)
              , SEQNR: sequence
              , INFTY: '3323'
              , REQST: requestNumber
              , DATUM: dateUtil.formatDate( requestDate, dateUtil.defaultSapCompiledFormat)
              , UZEIT: dateUtil.formatDate( requestDate, dateUtil.defaultSapTimeFormat)
              , UNAME: 917
            },
            IM_ATTA_DATA: {
                SEQNR: sequence
              , PERNR: employeeId
              , INFTY: '3323'
              , REQST: requestNumber
              , ENDDA: dateUtil.formatDate(toDate,dateUtil.defaultSapCompiledFormat)
              , BEGDA: dateUtil.formatDate(fromDate,dateUtil.defaultSapCompiledFormat)
              , FILEPASS: attachedFile.originalname
              , FILETYPE: 'PDF'
              , FILENAME: attachedFile.originalname.slice(0, -4)
              , LENGTH: attachedFile.buffer.length
              , PDFDATA: buffersArray
            }
          };

        const results = await sapClient.call('ZHR_SAVE_MANDATE_ATTA', sapParams);

        return true;

    } catch (error) {
        console.log(error);
        throw error;
    }
}