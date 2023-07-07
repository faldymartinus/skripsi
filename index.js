const express = require("express");
const app = express();
const routes = require('./routes/main');
const { mainView } = require("./controllers/mainController");
app.set('view engine', 'ejs');

app.get('/',mainView);

app.use('/config',routes)



app.listen(5000);
