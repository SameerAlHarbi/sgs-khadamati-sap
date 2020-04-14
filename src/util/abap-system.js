// ABAP system RFC connection parameters
const abapSystem = {
    // dest: process.env.SAP_DESTINATION_NAME,
    user: process.env.SAP_USER,
    passwd: process.env.SAP_PASSWORD,
    ashost: process.env.SAP_SERVER_HOST,
    sysnr: process.env.SAP_SYSTEM_NUMBER,
    client: process.env.SAP_CLIENT,
    lang: process.env.SAP_LANGUAGE
};

module.exports = abapSystem;