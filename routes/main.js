const express = require('express');
const bodyParser = require('body-parser');
const {mainView,
    hadoopSparkView,
    kafkaView,
    mqttView,
    openSearchView,
    kafkaSave,
    hadoopSave,
    mqttSave,
    openSearchSave,
    snortSave,
    snortView } = require('../controllers/mainController');
const { generateVagrantFile } = require('../controllers/vagrantFileController');
const router = express();

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json())

router.get('/hadoop-spark-config', hadoopSparkView);
router.get('/kafka-config', kafkaView);
router.get('/openSearch-config', openSearchView);
router.get('/mqtt-config', mqttView);
router.get('/snort-config', snortView);
router.get('/main', mainView);

router.post('/kafkaSave', kafkaSave)
router.post('/hadoopSave', hadoopSave)
router.post('/mqttSave', mqttSave)
router.post('/openSearchSave', openSearchSave)
router.post('/snortSave', snortSave)
router.post('/generate', generateVagrantFile)

module.exports = router;
