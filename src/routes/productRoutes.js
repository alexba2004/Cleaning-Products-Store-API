import express from "express";
import { productHome, productSale, shoppingCart, addShoppingCart } from "../controllers/productController.js";
const router = express.Router();

router.get("/home", productHome);
router.get("/products", productSale);
router.get("/shoppingCart", shoppingCart);
router.get("/prueba", shoppingCart);

router.post("/addToCart", addShoppingCart);

export default router;
