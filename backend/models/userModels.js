const mongoose =require("mongoose");
const validator=require("validator");
const bcryptjs=require("bcryptjs");
const jwt=require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter your name"],
        maxLength:[30,"Name cannot exceed 30 characters"],
        minLength:[2,"Name should be minimum 4 characters"]
    },
    email:{
        type:String,
        required:[true,"please enter your email"],
        unique:true,
        validate:[validator.isEmail,"please enter a valid email"]
    },
    password:{
        type:String,
        required:[true,"Enter your password"],
        minLength:[8,"minimum length should be 8 characters"],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user"
    },
    reserPasswordToken:String,
    reserPasswordExpire:Date,

});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password=await bcryptjs.hash(this.password,10);
})

// JWT token -> user can identifies the role
userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    });
};

// compare passwords
userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcryptjs.compare(enteredPassword,this.password)
}


module.exports=mongoose.model("User",userSchema);