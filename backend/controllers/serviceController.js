const Service=require("../models/serviceModal");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors=require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");

// create services --> admin
exports.createServices=catchAsyncErrors(async(req,res,next)=>{
    const service=await Service.create(req.body);
    res.status(200).json({
        suceess:true,
        service
    })
})

// get all services
exports.getAllServices=catchAsyncErrors(async(req,res)=>{

    const resultPerPage=5;
    const serviceCount=await Service.countDocuments();
    const apiFeatures=new ApiFeatures(Service.find(),req.query).search().filter().pagination(resultPerPage);
    const services=await apiFeatures.query;
    res.status(200).json({
        suceess:true,
        services
    })
})

// update the services --Admin
exports.updateServices=catchAsyncErrors(async(req,res,next)=>{
    let service=await Service.findById(req.params.id);
    if(!service){
        return next(new ErrorHandler("Service Not Found",404));
    }

    service=await Service.findByIdAndUpdate(req.params.id,req.body,
        {
            new:true,
            runValidators:true,
            useFindAndModify:false
        })

    res.status(200).json(
        {
            suceess:true,
            service,
            serviceCount
        }
    )
})


// delete the services -- admin
exports.deleteServices=catchAsyncErrors(async (req,res,next)=>{
    const service=await Service.findById(req.params.id);

    if(!service){
        return next(new ErrorHandler("Service Not Found",404));
    }

    await service.remove();

    return res.status(200).json({
        suceess:true,
        message:"Service deleted succesfully"
    })

})

// get single service --admin
exports.getServiceDetails=catchAsyncErrors(async (req,res,next)=>{
    const service=await Service.findById(req.params.id);

    if(!service){
        return next(new ErrorHandler("Service Not Found",404));
    }
    return res.status(200).json({
        suceess:true,
        service
    })
})