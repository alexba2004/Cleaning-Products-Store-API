import mercadopage from "mercadopago";
import dotenv from "dotenv";
dotenv.config({
    path: "src/.env",
});

const MERCADOPAGO_API_KEY = process.env.MERCADOPAGO_API_KEY;

export const createOrder = async (req, res) => {
    mercadopage.configure({
        access_token: MERCADOPAGO_API_KEY,
    });

    try {
        const { products } = req.body; // Cambiar el nombre del campo a 'products'

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
                // pending: "https://e720-190-237-16-208.sa.ngrok.io/pending",
                // failure: "https://e720-190-237-16-208.sa.ngrok.io/failure",
            },
        });

        console.log(result);

        // res.json({ message: "Payment creted" });
        res.json(result.body);
    } catch (error) {
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
        console.log(error);
        return res.status(500).json({ message: "Something goes wrong" });
    }
};
