const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors=require("../middleware/catchAsyncError");
const User=require("../models/userModels");
const sentToken = require("../utils/jwtToken");

// Register as user
exports.registerUser=catchAsyncErrors(async(req,res,next)=>{
    const {name,email,password} =req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:"This is sample id",
            url:"profile_url"
        }
    });
    sentToken(user,201,res);
})


 // Login User
exports.loginUser=catchAsyncErrors(async(req,res,next)=>{

    const {email,password}=req.body;

    // checking if user has given both password and email
    if(!email || !password){
        return next(new ErrorHandler("please enter Email and password",400));
    }

    const user=await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    // compare passwords
    const isPasswordMatched=await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    sentToken(user,200,res);
})

// logout user
exports.logOut=catchAsyncErrors(async(req,res,next)=>{

    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:"Logged Out"
    })

})