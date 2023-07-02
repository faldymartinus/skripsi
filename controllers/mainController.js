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
        openSearchIp = ''
        openSearchUser = ''
        openSearchPassword = ''
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

//////////////////////////////////////
////// Vagrant Related Functions/////
////////////////////////////////////
async function constructVagrantFile(){
    await constructVagrantHead()
    await sleep(100);
    await constructVagrantProvision()
    await sleep(100);
    await constructVagrantTail()
    await sleep(100);
}
function constructVagrantHead(){
    //append vagrantHeadtemplate
    var data = fs.readFileSync('./vagrantParts/vagrantHeadTemplate.txt');
    fs.appendFile('Vagrantfile', data+"\n", function (err) {
        if (err) throw err;
    });
}
function constructVagrantSplitter(){
    //append vagrantHeadtemplate
    var data = fs.readFileSync('./vagrantParts/vagrantSplitter.txt');
    fs.appendFile('Vagrantfile', data+"\n", function (err) {
        if (err) throw err;
    });
}
function constructVagrantIpAddress(){
    //append vagrantIpAddressTemplate
    var data = fs.readFileSync('./vagrantParts/vagrantIpAddressTemplate.txt');
    fs.appendFile('Vagrantfile', data+"\n", function (err) {
        if (err) throw err;
    });
}
function constructVagrantSpecification(){
    //append vagrantSpecificationsTemplate
    var data = fs.readFileSync('./vagrantParts/vagrantSpecificationsTemplate.txt');
    fs.appendFile('Vagrantfile', data+"\n", function (err) {
        if (err) throw err;
    });
}
function constructVagrantVariables(){
    //append vagrantHeadtemplate
    var data = fs.readFileSync('./variables.sh');
    fs.appendFile('Vagrantfile', data+"\n", function (err) {
        if (err) throw err;
    });
}
function constructVagrantPrerequisite(){
    //append vagrantSpecificationsTemplate
    var data = fs.readFileSync('./vagrantParts/vagrantComponentScripts/prerequisite.txt');
    fs.appendFile('Vagrantfile', data+"\n", function (err) {
        if (err) throw err;
    });
}
function constructVagrantProvision(){
    //append vagrantProvisionTemplate
    var data = fs.readFileSync('variables.json');
    var dataParsed= JSON.parse(data);
    //get all vmId
    Object.keys(dataParsed).forEach(async vmId => {   
        await constructVagrantSplitter()
        await sleep(1000);
        await constructVagrantIpAddress()
        await sleep(1000);
        await constructVagrantSpecification()
        await sleep(1000);    
        fs.appendFile('Vagrantfile', 'config.vm.provision "shell", inline: <<-SHELL'+"\n", await function (err) {
            if (err) throw err;
        });

        await sleep(1000);
        await constructVagrantVariables()
        await sleep(1000);
        await constructVagrantPrerequisite() 
        // console.log('vm:'+vmId)
        //get all component that need to be installed

        await Object.keys(dataParsed[`${vmId}`]).forEach( async component => { 
           console.log(component)
           var data = fs.readFileSync(`./vagrantParts/vagrantComponentScripts/${component}.txt`);
            fs.appendFile('Vagrantfile', data+"\n", await function (err) {
                if (err) throw err;
                
            });
        })    
        await sleep(100);
        fs.appendFile('Vagrantfile', 'SHELL'+"\n", await function (err) {
            if (err) throw err;
        });
        fs.appendFile('Vagrantfile', "end"+"\n",await function (err) {
            if (err) throw err;
            
        });   
    })
    // sleep(100);
}
function constructVagrantTail(){
    //append vagrantTailTemplate
    var data = fs.readFileSync('./vagrantParts/vagrantTailTemplate.txt');
    fs.appendFile('Vagrantfile', data+"\n", function (err) {
        if (err) throw err;
    });
}
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}
const generateVagrantFile = (req,res)=>{
    //bikin file variabel.sh
    var data = fs.readFileSync('variables.json');
    var dataParsed= JSON.parse(data);

    //get all vmId
    Object.keys(dataParsed).forEach(vmId => {    
        // console.log('vm:'+vmId)


        //get all component that need to be installed
        Object.keys(dataParsed[`${vmId}`]).forEach(component => { 
            //get attribute of each component
            Object.keys(dataParsed[`${vmId}`][`${component}`]).forEach(key => {   
                //get value of each attribute
                var value = dataParsed[`${vmId}`][`${component}`][`${key}`]
                //combine all needed attribute into string
                var variable = "export "+vmId+component+key +"="+ "'" +value+"'"
                //append each variables to file
                fs.appendFile('variables.sh', variable+"\n", function (err) {
                    if (err) throw err;
                });
            })
        })
    })
    //constructing vagrantfile from parts
    constructVagrantFile()
    //append variable.sh ke vagrant provision---done
    //append template instalasi tiap komponen ke vagrant provision---done
    //outputny brti ada 1 file, vagrantfile--done
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

/////////////////////////////////
/////// View FUNCTIONS /////////
///////////////////////////////
const addVmEmpty = (req, res) => {
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
