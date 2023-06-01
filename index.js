const express = require("express");
const app = express();
const routes = require('./routes/main')
app.set('view engine', 'ejs');

app.get('/', async(req,res)=>{
    res.render("mainPage.ejs")
    console.log("halo")
})

app.use('/config',routes)


app.listen(5000);
