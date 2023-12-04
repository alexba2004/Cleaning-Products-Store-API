import express from "express";
import { productHome, productSale, shoppingCart, addShoppingCart, deleteProduct } from "../controllers/productController.js";
const router = express.Router();

router.get("/home", productHome);
router.get("/products", productSale);
router.get("/shoppingCart", shoppingCart);

router.post("/addToCart", addShoppingCart);

// Ruta para agregar productos al carrito o actualizar la cantidad
router.post("/addToCart/:productId", addShoppingCart);

router.delete("/deleteProduct/:productId", deleteProduct);

export default router;
