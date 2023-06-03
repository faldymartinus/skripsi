
const mainView = (req, res) => {
    res.render("main", {
    } );
}

const hadoopSparkView = (req, res) => {
    res.render("hadoopSparkConfigView", {
    } );
}

const kafkaView = (req, res) => {
    console.log(req.query.vmId);
    res.render("kafkaConfigView", {
        
    } );
}

const mqttView = (req, res) => {
    res.render("mqttConfigView", {
    } );
}

const openSearchView = (req, res) => {
    res.render("openSearchConfigView", {
    } );
}

const kafkaSave = (req, res) => {
    console.log(req.body.kafkaIp)
}

const hadoopSave = (req, res) => {
    
    const fs = require('fs'); 
    try {
        var data = fs.readFileSync('variables.json');
    } catch (error) {
        console.log("done")
        data = {}
        writeToFiles(data);

    }
    
    var myObject= JSON.parse(data);
    var newkey = {key3: { key4 : req.body.hadoopIp}}
   
    //append key to object
    Object.assign(myObject, newkey);

    //write variable to file
    console.log(myObject)

    writeToFiles(myObject);
}

function writeToFiles(data){
    const fs = require('fs'); 
    var newData2 = JSON.stringify(data);
    fs.writeFile("variables.json", newData2, (err) => {
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
    hadoopSave
};
