const mongoose=require("mongoose");

const orderSchema=new mongoose.Schema({
    shippingInfo:{
        address:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true,
            default:"india"
        },
        pincode:{
            type:Number,
            required:true,
        },
        phoneNo:{
            type:Number,
            required:true,
        },
    },
    orderItems:[
        {
            name:{
                type:String,
                required:true
            },
            price:{
                type:Number,
                required:true,
            },
            image:{
                type:String,
                required:true
            },
            service:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"Service",
                required:true 
            },
            date:{
                type:Date,
                required:true
            },
            time:{
                hours: {
                    type: Number, required: true, min: 0, max: 23
                },
                minutes: {
                    type: Number, required: true, min: 0, max: 59
                }
            }
        }
    ],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    paymentInfo:{
        id:{
            type:String,
            required:true
        },
        status:{
            type:String,
            required:true
        }
    },
    paidAt:{
        type:Date,
        required:true
    },
    servicePrice:{
        type:Number,
        required:true,
        default:0
    },
    taxPrice:{
        type:Number,
        required:true,
        default:0
    },
    totalPrice:{
        type:Number,
        default:0
    },
    orderStatus:{
        type:String,
        required:true,
        default:"processing"
    },
    servicedAt:Date,
    createdAt:{
        type:Date,
        default:Date.now
    },
    workerDetials:{
        name:{
            type:String,
            required:true,
            default: " "
        },
        address:{
            type:String,
            required:true,
            default:" "
        },
        phone:{
            type:Number,
            required:true,
            default:0
        }
    }
})

module.exports=mongoose.model("Order",orderSchema);