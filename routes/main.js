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
    generate } = require('../controllers/mainController');
const router = express();

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json())

router.get('/hadoop-spark-config', hadoopSparkView);
router.get('/kafka-config', kafkaView);
router.get('/openSearch-config', openSearchView);
router.get('/mqtt-config', mqttView);
router.get('/main', mainView);

router.post('/kafkaSave', kafkaSave)
router.post('/hadoopSave', hadoopSave)
router.post('/mqttSave', mqttSave)
router.post('/openSearchSave', openSearchSave)
router.post('/generate', generate)

module.exports = router;
