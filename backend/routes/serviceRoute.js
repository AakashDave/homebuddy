const express=require('express');
const { getAllServices,createServices, updateServices, deleteServices, getServiceDetails } = require('../controllers/serviceController');
const {isAuthenticatedUser,authorizeRoles}=require("../middleware/auth");
const router=express.Router();

router.route("/services").get( getAllServices);
router.route("/services/new").post(isAuthenticatedUser , authorizeRoles("admin"), createServices);
router.route("/services/:id")
    .put(isAuthenticatedUser , authorizeRoles("admin"), updateServices)
    .delete(isAuthenticatedUser , authorizeRoles("admin") , deleteServices)
    .get(getServiceDetails);
// router.route("/services/:id").delete(deleteServices);
// router.route("/services/:id").get(getServiceDetails);

module.exports=router;