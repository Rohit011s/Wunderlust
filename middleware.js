module.exports.isLoggedIn = (req, res, next) => {
    let isloggedIn = req.isAuthenticated();
    if (!isloggedIn) {
        req.session.redirectUrl=req.originalUrl;
        return res.redirect('/login');
    }
    next();
};
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl; 
    }else{
        res.locals.redirectUrl="/listings";
    }
    next();
};