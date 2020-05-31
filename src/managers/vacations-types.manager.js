const sapPool = require('../util/sap-rfc');

exports.getAllVacationsTypes = async (workSystem = 'ALL',lang = 'A') => {

    lang = lang.toUpperCase();
    workSystem = workSystem.toUpperCase();

    try{
        const client = await sapPool.acquire();
        let sapResults = await client.call('ZHR_ATTENDANCE_ABSENCE_TYPES',{ 
            IM_LANGU: lang
        });

        if(!sapResults || !sapResults['T_T554T']) {
            return [];
        }

        const SGS = lang === 'A' ? 'العمل' : 'SGS';
        const PBS = lang === 'A' ? 'الخدمة المدنية' : 'PBS';

        let results = sapResults['T_T554T'].filter(vt => 
            !vt.ATEXT.includes('إذن') && 
            !vt.ATEXT.includes('Excuse') && 
            !vt.ATEXT.includes('انتداب') &&
            !vt.ATEXT.includes('Mandate')).map(vt =>(
                { 
                    id: vt.AWART,
                    name: vt.ATEXT,
                    workSystem: vt.ATEXT.includes('العمل') || vt.ATEXT.includes('SGS') ? SGS : PBS
                }
            ));

        if(workSystem !== 'ALL') {
            if(workSystem === 'SGS') {
                results = results.filter(vt => vt.workSystem === SGS);
            }
            else if(workSystem === 'PBS') {
                results = results.filter(vt => vt.workSystem === PBS);
            }
        }

        return results;
    } catch (e) {
        throw new Error(e.message);
    }
}