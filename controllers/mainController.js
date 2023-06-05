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
    const {hadoop,spark} = dataParsed[`${vmId}`]
    try {
        hadoopIp = hadoop.ipAddress
        hadoopUser =hadoop.userHadoop
        sparkIp = spark.ipAddress
    } catch (error) {
        hadoopIp, hadoopUser, sparkIp = ''
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
    } catch (error) {
        mqttUsername = ''
        mqttPassword = ''
    }
    res.render("mqttConfigView", {
        vmId, component, mqttUsername, mqttPassword
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
        openSearchIp,openSearchUser,openSearchPassword = ''
    }
    res.render("openSearchConfigView", {
        vmId, component, openSearchIp,openSearchUser,openSearchPassword
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
/////////////////////////////////
/////// MODULAR FUNCTIONS //////
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
    openSearchSave
};
