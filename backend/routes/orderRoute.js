const express=require("express");
const { newOrder, getSingleOrder,getAllOrder, myOrders, updateOrder, deleteOrder } = require("../controllers/orderController");
const router=express.Router();
const {isAuthenticatedUser,authorizeRoles}=require("../middleware/auth");


// create a order
router.route('/order/new').post(isAuthenticatedUser,newOrder);
router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder);
router.route('/orders/me').get(isAuthenticatedUser,myOrders);
router.route('/admin/orders').get(isAuthenticatedUser,authorizeRoles("admin"),getAllOrder);
router.route('/admin/orders/:id')
    .put(isAuthenticatedUser,authorizeRoles("admin"),updateOrder)
    .delete(isAuthenticatedUser,authorizeRoles("admin"),deleteOrder)
module.exports=router;