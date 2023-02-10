const express=require('express');
const { getAllServices,createServices, updateServices, deleteServices, getServiceDetails } = require('../controllers/serviceController');
const {isAuthenticatedUser,authorizeRoles}=require("../middleware/auth");
const router=express.Router();

router.route("/services").get(isAuthenticatedUser , authorizeRoles("admin"), getAllServices);
router.route("/services/new").post(isAuthenticatedUser , createServices);
router.route("/services/:id")
    .put(isAuthenticatedUser , updateServices)
    .delete(isAuthenticatedUser , deleteServices)
    .get(isAuthenticatedUser , getServiceDetails);
// router.route("/services/:id").delete(deleteServices);
// router.route("/services/:id").get(getServiceDetails);

module.exports=router;