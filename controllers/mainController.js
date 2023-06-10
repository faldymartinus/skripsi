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
const generateVagrantFile = (req,res)=>{
    //bikin file variabel.sh
    var data = fs.readFileSync('variables.json');
    var dataParsed= JSON.parse(data);

    //get all vmId
    Object.keys(dataParsed).forEach(vmId => {    
        console.log('vm:'+vmId)
        //get all component that need to be installed
        Object.keys(dataParsed[`${vmId}`]).forEach(component => { 
            //get attribute of each component
            Object.keys(dataParsed[`${vmId}`][`${component}`]).forEach(key => {   
                //get value of each attribute
                var value = dataParsed[`${vmId}`][`${component}`][`${key}`]
                //combine all needed attribute into string
                var variable = "EXPORT "+vmId+component+key +"="+ "'" +value+"'"
                //append each variables to file
                fs.appendFile('variables.sh', variable+"\n", function (err) {
                    if (err) throw err;
                });
            })
        })       
    })
    //append variable.sh ke vagrant provision
    //append template instalasi tiap komponen ke vagrant provision
    //outputny brti ada 2 file, vagrantfile dan variables.sh
}

//belum dipake
function generateVagrant(){
    var key = '<%- JSON.stringify(dataParsed) %>'
      var dataParsed= JSON.parse(key);
    Object.keys(dataParsed).forEach(vmId => {    
      console.log('vm:'+vmId)

      Object.keys(dataParsed[`${vmId}`]).forEach(component => { 
      
      var keyObject = (
        Object.keys(dataParsed[`${vmId}`][`${component}`]).forEach(key => {   
          console.log(key)
        }))

      var valueObject = (
        Object.values(dataParsed[`${vmId}`][`${component}`]).forEach(values => { 
          console.log(values)
        }))
      // console.log(keyObject+": "+valueObject)
      })       
    })
  }

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
    generateVagrantFile
};
