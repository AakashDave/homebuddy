const express=require('express');
const { getAllServices,createServices, updateServices, deleteServices, getServiceDetails, createServiceReview, getServiceReviews, deleteServiceReviews } = require('../controllers/serviceController');
const {isAuthenticatedUser,authorizeRoles}=require("../middleware/auth");
const router=express.Router();

router.route("/services").get( getAllServices);
router.route("/admin/services/new").post(isAuthenticatedUser , authorizeRoles("admin"), createServices);
router.route("/admin/services/:id")
    .put(isAuthenticatedUser , authorizeRoles("admin"), updateServices)
    .delete(isAuthenticatedUser , authorizeRoles("admin") , deleteServices);
// router.route("/services/:id").delete(deleteServices);
router.route("/services/:id").get(getServiceDetails);

router.route("/review").put(isAuthenticatedUser,createServiceReview);
router.route("/review").get(getServiceReviews).delete(isAuthenticatedUser,deleteServiceReviews);
module.exports=router;