import express from "express";
import { createPaypalOrder, capturePaypalOrder } from "../controllers/usersmanagement/payments.js";

const router = express.Router();

// endpoints related to payments with PayPal
router.post("/paypal/create-paypal-order", createPaypalOrder);
router.post("/paypal/orders/:orderID/capture", capturePaypalOrder);

export default router;
