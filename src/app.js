const express = require("express");
const app = express();


//Making middleware to check authenticated user
app.use("/admin", (req, res, next) => {
    const requestToken = "xyzeee";
    let isAuthenticated = false;
    if (requestToken === "xyz") isAuthenticated = true;
    if (isAuthenticated) {
        next();
    }
    else{
        res.status(401).send("User is not authorised")
    }

}
)
app.get("/admin/isLogin",(req,res)=>{
    res.send("Hey Admin ")
})
app.listen("3000", () => {
    console.log("Server is listening to 3000");

})


