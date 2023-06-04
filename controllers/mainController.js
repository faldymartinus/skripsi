const fs = require('fs'); 

const mainView = (req, res) => {
    res.render("main", {
    } );
}

const hadoopSparkView = (req, res) => {
    const { vmId } = req.query;
    res.render("hadoopSparkConfigView", {
        vmId
    } );
}

const kafkaView = (req, res) => {
    const { vmId, component } = req.query;
    res.render("kafkaConfigView", {
        vmId,component
    } );
}

const kafkaSave = (req, res) => {
    const { vmId ,component } = req.query;
    var userVariables = {
        [`${component}`]: {
            ipAddress : req.body.kafkaIp
            }
    }
    saveData(userVariables,vmId)
}

const mqttView = (req, res) => {
    const { vmId, component } = req.query;
    res.render("mqttConfigView", {
        vmId, component
    } );
}

const mqttSave = (req, res) => {
    const { vmId ,component } = req.query;
    var userVariables = {
        [`${component}`]: {
            username : req.body.mqttUsername,
            password : req.body.mqttPassword
            }
    }
    saveData(userVariables,vmId)
}

const openSearchView = (req, res) => {
    const { vmId, component } = req.query;
    res.render("openSearchConfigView", {
        vmId, component 
    } );
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
}

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
}

function saveData(userVariables,vmId){
    createEmptyVarFile(vmId)
    var data = fs.readFileSync('variables.json');
    var dataParsed= JSON.parse(data);
    
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
    openSearchSave
};
