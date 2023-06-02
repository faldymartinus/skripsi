
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
    console.log(req.body.hadoopIp)
    const fs = require('fs'); 
    var jsonData = `{
        "vm": {
            "hadoop": {
                "ip": ${req.body.hadoopIp}
            }
        }
    }`


 
    // parse json
    var jsonObj = JSON.parse(jsonData);
    console.log(jsonObj);
    
    // stringify JSON Object
    var jsonContent = JSON.stringify(jsonObj);
    console.log(jsonContent);
    
    fs.writeFile("outputs.json", jsonContent, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
    
        console.log("JSON file has been saved.");
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
