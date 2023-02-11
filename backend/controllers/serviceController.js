const Service=require("../models/serviceModal");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors=require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");

// create services --> admin
exports.createServices=catchAsyncErrors(async(req,res,next)=>{

    req.body.user=req.user.id;

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

// Create a review or update the review
exports.createServiceReview=catchAsyncErrors(async (req,res,next)=>{

    const {rating,comment,serviceId}=req.body;
    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment
    };

    const service=await Service.findById(serviceId);

    const isReviewed=service.reviews.find(rev=>rev.user.toString()===req.user._id.toString());
    if(isReviewed){
        service.reviews.forEach(rev=>{
            if(service.reviews.find(rev=>rev.user.toString()===req.user._id.toString())){
                rev.rating=rating,
                rev.comment=comment
            }
        })
    }else{
        service.reviews.push(review);
        service.numOfRevies=service.reviews.length
    }

    let avg=0;
    service.reviews.forEach(rev=>{
        avg+=rev.rating;
    });
    service.ratings=avg/service.reviews.length;

    await service.save({validateBeforeSave:false});

    res.status(200).json({
        suceess:true
    })
})

// Get All reviews of services
exports.getServiceReviews=catchAsyncErrors(async(req,res,next)=>{
    const service=await Service.findById(req.query.id);
    if(!service){
        return next(new ErrorHandler("service not found",404))
    }
    res.status(200).json({
        suceess:true,
        reviews:service.reviews,
    })
})

// delete reviews of services
exports.deleteServiceReviews=catchAsyncErrors(async(req,res,next)=>{
    const service=await Service.findById(req.query.serviceId);
    if(!service){
        return next(new ErrorHandler("service not found",404))
    }
    const reviews=service.reviews.filter(rev=>rev._id.toString() !==req.query.id.toString())
    let avg=0;
    reviews.forEach(rev=>{
        avg+=rev.rating;
    });
    const ratings=avg/reviews.length;

    const numOfReviews=reviews.length;
    await Service.findByIdAndUpdate(req.query.serviceId,
        {
            reviews,
            ratings,
            numOfReviews
        },{
            new:true,
            runValidators:true,
            userFindAndModify:false
        });
    res.status(200).json({
        suceess:true,
    })
})