import { Router } from "express";
import { createOrder } from "../controllers/paymentController.js";

const router = Router();

router.post("/create-order", createOrder);

//router.post("/webhook", receiveWebhook);

router.get("/success", (req, res) => res.redirect("/products/home"));

export default router;
