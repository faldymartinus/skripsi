const fs = require('fs'); 

const mainView = (req, res) => {
    console.log("runned")
    var data = fs.readFileSync('variables.json');
    var dataParsed= JSON.parse(data);
    // console.log(dataParsed)
    res.render("mainPage", {
        dataParsed
    } );
}

//////////////////////////////
/////// VIEW FUNCTIONS //////
////////////////////////////

const hadoopSparkView = (req, res) => {
    const { vmId } = req.query;
    var data = fs.readFileSync('variables.json');
    var dataParsed= JSON.parse(data);
    console.log(dataParsed)
    try {
        const {hadoop,spark} = dataParsed[`${vmId}`]
        hadoopIp = hadoop.ipAddress
        hadoopUser =hadoop.userHadoop
        sparkIp = spark.ipAddress
    } catch (error) {
        hadoopIp= ''
        hadoopUser= ''
        sparkIp = ''
    }     
    res.render("hadoopSparkConfigView", {
        vmId,hadoopIp,hadoopUser,sparkIp
    } );
}

const kafkaView = (req, res) => {
    const { vmId, component } = req.query;
    var data = fs.readFileSync('variables.json');
    var dataParsed= JSON.parse(data);
    console.log(dataParsed)
    try {
        kafkaIp = dataParsed[`${vmId}`][`${component}`].ipAddress
    } catch (error) {
        kafkaIp = ''
    }
    res.render("kafkaConfigView", {
        vmId,component,kafkaIp
    } );
}

const mqttView = (req, res) => {
    const { vmId, component } = req.query;
    var data = fs.readFileSync('variables.json');
    var dataParsed= JSON.parse(data);
    try {
        mqttUsername = dataParsed[`${vmId}`][`${component}`].username
        mqttPassword = dataParsed[`${vmId}`][`${component}`].password
        mqttIP = dataParsed[`${vmId}`][`${component}`].mqttIP
    } catch (error) {
        mqttUsername = ''
        mqttPassword = ''
        mqttIP = ''
    }
    res.render("mqttConfigView", {
        vmId, component, mqttUsername, mqttPassword,mqttIP
    } );
}

const openSearchView = (req, res) => {
    const { vmId, component } = req.query;
    var data = fs.readFileSync('variables.json');
    var dataParsed= JSON.parse(data);
    try {
        openSearchIp = dataParsed[`${vmId}`][`${component}`].ipAddress
        openSearchUser = dataParsed[`${vmId}`][`${component}`].user
        openSearchPassword = dataParsed[`${vmId}`][`${component}`].password
        
    } catch (error) {
        openSearchIp = ''
        openSearchUser = ''
        openSearchPassword = ''
    }
    res.render("openSearchConfigView", {
        vmId, component, openSearchIp,openSearchUser,openSearchPassword
    } );
}

const snortView = (req, res) => {
    const { vmId, component } = req.query;
    var data = fs.readFileSync('variables.json');
    var dataParsed= JSON.parse(data);
    try {
        snortMonitoredNetwork = dataParsed[`${vmId}`][`${component}`].snortMonitoredNetwork
        
    } catch (error) {
        snortMonitoredNetwork = ''

    }
    res.render("snortConfigView", {
        vmId, component, snortMonitoredNetwork
    } );
}

const vmView = (req, res) => {
    const { vmId, component } = req.query;

    try {
        var data = fs.readFileSync('vmSpecification.json');
        var dataParsed= JSON.parse(data);
        privateNetwork = dataParsed[`${vmId}`][`${component}`].privateNetwork,
        publicNetwork = dataParsed[`${vmId}`][`${component}`].publicNetwork,
        RAM = dataParsed[`${vmId}`][`${component}`].RAM,
        CPU = dataParsed[`${vmId}`][`${component}`].CPU
        
    } catch (error) {
        privateNetwork =''
        publicNetwork = ''
        RAM = ''
        CPU = ''

    }
    res.render("vmConfigView", {
        vmId, privateNetwork, publicNetwork, RAM, CPU
    } );
}


//////////////////////////////
/////// POST FUNCTIONS //////
////////////////////////////

const hadoopSave = (req, res) => {
    const { vmId ,component } = req.query;
    var userVariables = {
        [`${component}`]: {
            ipAddress : req.body.hadoopIp,
            userHadoop : req.body.hadoopUser
            },
        spark: {
            ipAddress : req.body.sparkIp
        }
    }
    saveData(userVariables,vmId)
    res.redirect('/');
}

const kafkaSave = (req, res) => {
    const { vmId ,component } = req.query;
    var userVariables = {
        [`${component}`]: {
            ipAddress : req.body.kafkaIp
            }
    }
    saveData(userVariables,vmId)
    res.redirect('/');
}

const mqttSave = (req, res) => {
    const { vmId ,component } = req.query;
    var userVariables = {
        [`${component}`]: {
            username : req.body.mqttUsername,
            password : req.body.mqttPassword,
            mqttIP : req.body.mqttIP
            
            }
    }
    saveData(userVariables,vmId)
    res.redirect('/');
}

const openSearchSave = (req, res) => {
    const { vmId ,component } = req.query;
    var userVariables = {
        [`${component}`]: {
            ipAddress : req.body.openSearchIp,
            user : req.body.openSearchUser,
            password : req.body.openSearchPassword,
            }
    }
    saveData(userVariables,vmId)
    res.redirect('/');
}

const snortSave = (req, res) => {
    const { vmId ,component } = req.query;
    var userVariables = {
        
        [`${component}`]: {
            snortMonitoredNetwork : req.body.snortMonitoredNetwork
            }
    }
    saveData(userVariables,vmId)
    res.redirect('/');
}

const vmSave = (req, res) => {
    const { vmId} = req.query;
    var userVariables = {
            privateNetwork : req.body.privateNetwork,
            publicNetwork : req.body.publicNetwork,
            RAM : req.body.RAM,
            CPU : req.body.CPU      
    }
    vmSaveData(userVariables,vmId)
    res.redirect('/');
}

/////////////////////////////////
// VM Specification FUNCTIONS //
///////////////////////////////

function vmSaveData(userVariables,vmId){
    vmCreateEmptyVarFile(vmId)
    var data = fs.readFileSync('vmSpecification.json');
    var dataParsed= JSON.parse(data);
    // console.log(keyCount)
    vmCreateNewVmVars(dataParsed,vmId)
    //append new data to old one
    Object.assign(dataParsed[`${vmId}`], userVariables);
    vmWriteToFiles(dataParsed)
}

function vmCreateEmptyVarFile(vmId){
    if(fs.existsSync('vmSpecification.json')==false){
        data = {[`${vmId}`]:{}}
        vmWriteToFiles(data);
    }
}

async function vmCreateNewVmVars(dataParsed,vmId){
    if(dataParsed[`${vmId}`]==null){

        var vmVariables = {
            [`${vmId}`]: {}
        }
        Object.assign(dataParsed, vmVariables);
        vmWriteToFiles(dataParsed)
    }
}

function vmWriteToFiles(data){
    var dataStringified = JSON.stringify(data);

    fs.writeFileSync("vmSpecification.json", dataStringified, (err) => {
        if (err) throw err;
        console.log("New data added");
        });
}

/////////////////////////////////
// Variables MODULAR FUNCTIONS /
///////////////////////////////

function saveData(userVariables,vmId){
    createEmptyVarFile(vmId)
    var data = fs.readFileSync('variables.json');
    var dataParsed= JSON.parse(data);
    // console.log(keyCount)
    createNewVmVars(dataParsed,vmId)
    //append new data to old one
    Object.assign(dataParsed[`${vmId}`], userVariables);
    writeToFiles(dataParsed)
}

function createEmptyVarFile(vmId){
    if(fs.existsSync('variables.json')==false){
        data = {[`${vmId}`]:{}}
        writeToFiles(data);
    }
}

async function createNewVmVars(dataParsed,vmId){
    if(dataParsed[`${vmId}`]==null){
        // createNewVmVars(vmId)
        var vmVariables = {
            [`${vmId}`]: {}
        }
        Object.assign(dataParsed, vmVariables);
        writeToFiles(dataParsed)
    }
}

function writeToFiles(data){
    var dataStringified = JSON.stringify(data);

    fs.writeFileSync("variables.json", dataStringified, (err) => {
        if (err) throw err;
        console.log("New data added");
        });
}



module.exports =  {
    mainView,
    hadoopSparkView,
    kafkaView,
    mqttView,
    openSearchView,
    kafkaSave,
    hadoopSave,
    mqttSave,
    openSearchSave,
    snortSave,
    snortView,
    vmView,
    vmSave
};
