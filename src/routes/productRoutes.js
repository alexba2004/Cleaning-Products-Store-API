import express from "express";
import { productHome, productSale, shoppingCart, addShoppingCart, deleteProduct, calculateTotal, getProductQuantity, deleteCartItem } from "../controllers/productController.js";
const router = express.Router();

router.get("/home", productHome);
router.get("/products", productSale);
router.get("/shoppingCart", shoppingCart);

router.post("/addToCart", addShoppingCart);

// Ruta para agregar productos al carrito o actualizar la cantidad
router.post("/addToCart/:productId", addShoppingCart);

router.delete("/deleteProduct/:productId", deleteProduct);

router.get("/calculateTotal", calculateTotal);
router.get("/getQuantity/:productId", getProductQuantity);
router.delete("/deleteProduct/:productId", deleteCartItem);
export default router;
