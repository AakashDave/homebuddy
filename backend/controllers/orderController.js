const catchAsyncError = require("../middleware/catchAsyncError");
const Order=require("../models/orderModal");
const Service=require("../models/serviceModal");
const ErrorHandler = require("../utils/errorHandler");

// create new Order

exports.newOrder=catchAsyncError(async(req,res,next)=>{
    const {shippingInfo,orderItems,paymentInfo,servicePrice,taxPrice,totalPrice}=req.body;

    const order=await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        servicePrice,
        taxPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id
    })

    res.status(201).json({
        success:true,
        order
    })
})

// get single order detials
exports.getSingleOrder=catchAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id).populate("user","name email");
    if(!order){
        return next(new ErrorHandler("Order Not Found With this id",404));
    }

    res.status(200).json({
        success:true,
        order
    })
})

// get legged in order detials
exports.myOrders=catchAsyncError(async(req,res,next)=>{
    const orders=await Order.find({user:req.user.id});
    if(!orders){
        return next(new ErrorHandler("Order Not Found With this id",404));
    }

    res.status(200).json({
        success:true,
        orders
    })
})

// get all order detials
exports.getAllOrder=catchAsyncError(async(req,res,next)=>{
    const orders=await Order.find();

    let totalAmount=0;
    orders.forEach(order=>{
        totalAmount+=order.totalPrice;
    })

    if(!orders){
        return next(new ErrorHandler("Order Not Found With this id",404));
    }

    res.status(200).json({
        success:true,
        orders,
        totalAmount
    })
})

// update order Status
exports.updateOrder=catchAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order Not Found With this id",404));
    }
    if(order.orderStatus=="completed"){
        return next( new ErrorHandler("Aleready completed this service",400));
    }
    
        if(req.body.status==="assigned"){
            order.orderStatus=req.body.status;
            order.workerDetials.name=req.body.nameofworker;
            order.workerDetials.address=req.body.addressofworker;
            order.workerDetials.phone=req.body.phoneofworker;
        }
        if(req.body.status==="completed" && order.workerDetials.name === " "){
            return next(new ErrorHandler("worker detials are empty so this service can not be complete",400))
            
        }
        if(req.body.status==="completed" && order.workerDetials.name !== " "){
            order.orderStatus=req.body.status;
            order.servicedAt=Date.now();
        }
    

    await order.save({
        validateBeforeSave:false
    })

    res.status(200).json({
        success:true,
        order
    })
})

// delete order 
exports.deleteOrder=catchAsyncError(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order Not Found With this id",404));
    }
    await order.remove()

    res.status(200).json({
        success:true
    })
})