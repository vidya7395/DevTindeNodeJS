 const adminAuth =  (req, res, next) => {
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

const userAuth = (req,res,next)=>{
    const {token:requestToken} = req.query;
    let isAuthenticated = false;
    if (requestToken === "xyz") isAuthenticated = true;
    if (isAuthenticated) {
        next();
    }
    else{
        res.status(401).send("User is not authorised")
    }
}


module.exports ={
    adminAuth,
    userAuth
}