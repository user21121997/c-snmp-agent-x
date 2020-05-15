
const { execSync } = require('child_process');

module.exports = ()=>{
    try {
        const ans = execSync("du -sh -B1 /var/log | cut -f1");
        return Number(ans);

    } catch (error) {
        console.error('Error, Cannot Determine Signals Value');
        console.error(error);
    }

};