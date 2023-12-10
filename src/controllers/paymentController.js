// controllers/paymentController.js
import mercadopago from "mercadopago";
import dotenv from "dotenv";
import ShoppingCart from "../models/shoppingCart.js";
import Product from "../models/product.js";
import UserPurchase from "../models/userPurchase.js";
import jsonWebToken from "jsonwebtoken";

dotenv.config({
    path: "src/.env",
});

const MERCADOPAGO_API_KEY = process.env.MERCADOPAGO_API_KEY;

// Método para obtener el userId desde el token
const getUserIdFromToken = (req) => {
    const token = req.cookies._token;
    if (!token) {
        return null; // O manejar el error de alguna manera
    }

    try {
        const decoded = jsonWebToken.verify(token, process.env.JWT_SECRET_HASH_STRING);
        return decoded.userID;
    } catch (error) {
        console.error("Error al decodificar el token:", error);
        return null; // O manejar el error de alguna manera
    }
};

export const createOrder = async (req, res) => {
    mercadopago.configure({
        access_token: MERCADOPAGO_API_KEY,
    });

    try {
        // Obtén el ID del usuario autenticado
        const userId = getUserIdFromToken(req);

        // Consulta la base de datos para obtener los productos del carrito del usuario
        const shoppingCartItems = await ShoppingCart.findAll({
            where: { UserId: userId },
            include: [{ model: Product }],
        });

        if (!shoppingCartItems || shoppingCartItems.length === 0) {
            return res.status(400).json({ message: "No products in the shopping cart" });
        }

        // Construye un identificador único para la compra
        const purchaseIdentifier = shoppingCartItems.map((item) => `${item.Product.id}-${item.quantity}`).join(",");

        // Verifica si ya existe una compra para esta combinación de productos
        const existingPurchase = await UserPurchase.findOne({
            where: { purchaseIdentifier },
        });

        if (existingPurchase) {
            console.log("La compra ya existe para esta combinación de productos.");
            return res.status(400).json({ message: "Duplicate purchase request" });
        }

        const items = shoppingCartItems.map((item) => ({
            title: item.Product.productName || "Unknown",
            unit_price: parseFloat(item.Product.price) || 0,
            currency_id: "MX", // Puedes ajustar esto según tus necesidades
            quantity: item.quantity || 1,
        }));

        const result = await mercadopago.preferences.create({
            items,
            notification_url: "https://e720-190-237-16-208.sa.ngrok.io/webhook",
            back_urls: {
                success: "http://localhost:3022/success",
            },
        });

        // Obtén el total de la compra sumando los precios de los productos
        const totalPayment = shoppingCartItems.reduce((total, item) => total + parseFloat(item.Product.price) * item.quantity, 0);

        // Concatena los nombres de los productos con sus cantidades
        const productDetails = shoppingCartItems.map((item) => `Nombre del producto: ${item.Product.productName || "Unknown"} Cantidad: ${item.quantity || 1}`);

        // Almacena la compra en la base de datos (UserPurchase)
        await UserPurchase.create({
            totalPayment,
            description: productDetails.join(", "),
            purchaseIdentifier,
            UserId: userId,
        });

        // Elimina productos del carrito en la base de datos (ShoppingCart)
        await ShoppingCart.destroy({
            where: { UserId: userId },
        });

        console.log(result);

        res.json(result.body);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something goes wrong" });
    }
};

export { getUserIdFromToken }; // Agregamos la exportación del método getUserIdFromToken
