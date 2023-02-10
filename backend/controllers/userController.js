const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors=require("../middleware/catchAsyncError");
const User=require("../models/userModels");
const sentToken = require("../utils/jwtToken");
const sendEmail=require("../utils/sendEmail");
const crypto=require("crypto");

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

// Forgot password 
exports.forgotPassword=catchAsyncErrors(async (req,res,next)=>{
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return next(new ErrorHandler("user not found",404));
    }
    // get reset password token from model
    const resetToken = await user.getResetPasswordToken();

    await user.save({validateBeforeSave:false});

    const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message=`Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not request this email then,please ignore it`;

    try{
        await sendEmail({
            email:user.email,
            subject:"HomeBuddy password Recovery",
            message
        });
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`
        })
    }catch(error){
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save({validateBeforeSave:false});
        return next(new ErrorHandler(error.message,500))
    }
})

// reset password
exports.resetPassword=catchAsyncErrors(async (req,res,next)=>{
    const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user=await User.findOne({resetPasswordToken,resetPasswordExpire:{$gt:Date.now()}});

    if(!user){
        return next(new ErrorHandler("RESET password token is invalid or has been expired",400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("password does't match",400));
    }

    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;

    await user.save();
    sentToken(user,200,res);
});
