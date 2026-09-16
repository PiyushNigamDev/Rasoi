import express from "express";
 import auth, { optionalAuth, vendorOnly } from "../middleware/authMiddleware.js";
import uploads from "../middleware/imageMiddleware.js";
import { createRecipe,updateRecipe,getAll,getById,deleteRecipe } from "../controllers/recipeController.js";
import {
    registerUser,
    loginUser
} from "../controllers/authController.js";
import { loginAdmin, loginVendor, registerVendor } from "../controllers/adminController.js";
import {
    createPaymentOrder,
    verifyPayment,
    getMyOrders,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/register" , registerUser);

router.post("/login", loginUser);
router.post("/admin/login", loginAdmin);
router.post("/vendor/login", loginVendor);
router.post("/vendor/register", registerVendor);
router.post("/orders/create", auth, createPaymentOrder);
router.post("/orders/verify-payment", auth, verifyPayment);
router.get("/orders/my", auth, getMyOrders);

router.post("/create", auth, vendorOnly, uploads.single("image"), createRecipe);
router.put("/update/:id", auth, vendorOnly, uploads.single("image"), updateRecipe);
router.get("/getall", optionalAuth, getAll);
router.get("/getall/:id",getById);
router.delete("/delete/:id", auth, vendorOnly, deleteRecipe);
export default router;