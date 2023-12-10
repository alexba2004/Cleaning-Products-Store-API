import mercadopage from "mercadopago";
import dotenv from "dotenv";
import UserPurchase from "../models/userPurchase.js";
import ShoppingCart from "../models/shoppingCart.js";

dotenv.config({
    path: "src/.env",
});

const MERCADOPAGO_API_KEY = process.env.MERCADOPAGO_API_KEY;

export const createOrder = async (req, res) => {
    mercadopage.configure({
        access_token: MERCADOPAGO_API_KEY,
    });

    try {
        const { products } = req.body;

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Invalid or missing products data" });
        }

        const items = products.map((product) => ({
            title: product.title || "Unknown",
            unit_price: product.unit_price || 0,
            currency_id: product.currency_id || "MX",
            quantity: product.quantity || 1,
        }));

        const result = await mercadopage.preferences.create({
            items,
            notification_url: "https://e720-190-237-16-208.sa.ngrok.io/webhook",
            back_urls: {
                success: "http://localhost:3022/success",
            },
        });

        // Obtén el total de la compra sumando los precios de los productos
        const totalPayment = products.reduce((total, product) => total + product.unit_price * (product.quantity || 1), 0);

        // Almacena la compra en la base de datos (UserPurchase)
        await UserPurchase.create({
            totalPayment,
            UserId: 1, // Reemplaza con el valor correcto para el ID del usuario
        });

        // Elimina productos del carrito en la base de datos (ShoppingCart)
        await ShoppingCart.destroy({
            where: { UserId: 1 }, // Reemplaza con el valor correcto para el ID del usuario
        });

        console.log(result);

        res.json(result.body);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something goes wrong" });
    }
};

export const receiveWebhook = async (req, res) => {
    try {
        const payment = req.query;
        console.log(payment);
        if (payment.type === "payment") {
            const data = await mercadopage.payment.findById(payment["data.id"]);
            console.log(data);
        }

        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something goes wrong" });
    }
};
