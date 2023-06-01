
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
