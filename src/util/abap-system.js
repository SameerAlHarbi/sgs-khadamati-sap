// ABAP system RFC connection parameters
const abapSystem = {
    connectionParameters: { 
    user: process.env.SAP_USER,
    passwd: process.env.SAP_PASSWORD,
    ashost: process.env.SAP_SERVER_HOST,
    sysnr: process.env.SAP_SYSTEM_NUMBER,
    client: process.env.SAP_CLIENT,
    lang: process.env.SAP_LANGUAGE, 
    dest: process.env.SAP_DESTINATION_NAME } 
};

module.exports = abapSystem;