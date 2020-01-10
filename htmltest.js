const express = require("express")
const  app = express();
app.get("/", function(rec,res){
    res.send("Sslam");
})
app.listen(800);