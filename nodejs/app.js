const snmp = require('net-snmp');
const getDiskBytes = require('./scripts/sizeDiskBytes');
const getSignalValue = require('./scripts/snmpSignalsValue');


var options = {
    master: "127.0.0.1" ,
    masterPort: 705,
    timeout: 0,
    description: "Node net-snmp AgentX sub-agent",
};

var callback = function (error, data) {
    if ( error ) {
        console.error (error);
    } else {
        console.log (JSON.stringify(data, null, 2));
    }
};

agent = snmp.createSubagent (options);
var mib = agent.getMib ();

var softwareVersionProvider = {
    name: "version",
    type: snmp.MibProviderType.Scalar,
    oid: "1.3.6.1.4.1.53864.1.1.1",
    scalarType: snmp.ObjectType.OctetString,
    handler: function (mibRequest) {
       // e.g. can update the MIB data before responding to the request here
       mibRequest.done ();
    }
};
mib.registerProvider (softwareVersionProvider);
mib.setScalarValue ("version", "6.1.1");

var diskSpaceBytesProvider = {
    name: "diskSpace",
    type: snmp.MibProviderType.Scalar,
    oid: "1.3.6.1.4.1.53864.1.1.2",
    scalarType: snmp.ObjectType.Integer,
    handler: function (mibRequest) {
        mib.setScalarValue ("diskSpace", getDiskBytes());
        mibRequest.done ();
    }
};
mib.registerProvider (diskSpaceBytesProvider);
var signalValueProvider = {
    name: "signalValue",
    type: snmp.MibProviderType.Scalar,
    oid: "1.3.6.1.4.1.53864.1.1.3",
    scalarType: snmp.ObjectType.Integer,
    handler: function (mibRequest) {
        mib.setScalarValue ("signalValue", getSignalValue());
        mibRequest.done ();
    }
};

agent.open(function (error) {

    console.info( 'Afiniti SNMP Agent Started ....');
    if ( error ) {
        console.error (error);
    } else {
        agent.registerProvider (softwareVersionProvider, null);
        agent.getMib ().setScalarValue ("version", "6.1.1");
        agent.registerProvider (signalValueProvider, null);
        agent.getMib ().setScalarValue ("diskSpace", 0);
        agent.registerProvider (diskSpaceBytesProvider, null);
        agent.getMib ().setScalarValue ("signalValue", 0);
    
    }
});


