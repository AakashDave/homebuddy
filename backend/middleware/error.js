const ErrorHandler=require("../utils/errorHandler");

module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;
    err.message=err.message || "Internal Server Error";

    // Wrong MongoDb Id Error
    if(err.name === "CastError"){
        const message=`Resource Not Found, Invalid : ${err.path}`;
        err=new ErrorHandler(message,400);
    }

    // mongoose duplicate Error
    if(err.code===11000){
        const message=`Email is aleready Exists`;
        err=new ErrorHandler(message,400);
    }

     // Wrong json token Error
     if(err.name === "JsonWebTokenError"){
        const message=`Json Web token is invalid,try again`;
        err=new ErrorHandler(message,400);
    }

     // json Expire Error
     if(err.name === "TokenExpireError"){
        const message=`token is expired,try again`;
        err=new ErrorHandler(message,400);
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message,
    })
}