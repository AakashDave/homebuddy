const mongoose=require("mongoose");
const serviceSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter service name"],
        trim:true
    },
    description:{
        type:String,
        required:[true,'enter description']
    },
    price:{
        type:Number,
        required:[true,"please Enter service price"],
        maxLength:[8,"price can not exceed 8 figures"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    category:{
        type:String,
        required:[true,"please enter service category"]
    },
    numOfRevies:{
        type:Number,
        default:0
    },
    isServiceAvailable:{
        type:Boolean,
        required:true,
        default:true
    },
    reviews:[
        {   user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },comment:{
                type:String,
                required:true
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model("Service",serviceSchema);