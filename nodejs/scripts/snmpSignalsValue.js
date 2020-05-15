const pgClient = require('./database');

module.exports =()=>{
    try {
        const rows = pgClient.querySync(
            'SELECT SIGNALVALUE FROM SNMPSIGNALS ORDER BY SIGNALTIME DESC  LIMIT 1'
          );
          return Number(rows[0].signalvalue);

    } catch (error) {
        console.error('Error, Cannot Determine Signals Value');
        console.error(error);
    }

};