const Client = require('pg-native');
const client = new Client();
var conString = "postgres://rehan:123@localhost:5432/AFINITITEST";
try {
  client.connect(conString,function(err) {
    if(err) throw err
    
    console.log('connected with connection string!')
  });
} catch (error) {
  console.error("Error connecting to DB. Please try Again!!");
  console.error(error);
  process.exit(1);
}

module.exports = client;