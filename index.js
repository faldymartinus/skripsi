const express = require("express");
const app = express();
app.set('view engine', 'ejs');

app.get('/', async(req,res)=>{
    res.render("mainPage.ejs")
    console.log("halo")
})

app.get('/configure', async(req,res)=>{
    res.render("configurationPage.ejs")
    console.log("halo")
})

app.listen(5000);
