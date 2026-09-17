const express = require("express");
const app = express();
const session = require("express-session");



app.use(session({secret: "mysupersecretstring"}));


app.get("/test" , (req,res) => {
    res.send("succesful test");
});
app.listen(3000 , (req,res) => {
    console.log("server is running");
})