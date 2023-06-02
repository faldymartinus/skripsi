
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
    
    // console.log(req.body.hadoopIp)
    const fs = require('fs'); 
    var data = fs.readFileSync('outputs.json');
    var myObject= JSON.parse(data);
    var newkey = {key3: { key4 :"value3"}}
    // var jason = {
    //     a :{
    //         b:'C'
    //     }
    // }
    Object.assign(myObject.vm2, newkey);

    
console.log(myObject)

   
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
