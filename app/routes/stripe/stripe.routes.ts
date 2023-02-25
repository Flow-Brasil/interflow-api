import { Router } from "express";

import StripeController from "@controller/stripe/StripeController";

const stripeRoutes = Router();

// ------------ POST REQUESTS
stripeRoutes.post("/payment/create/:id", StripeController.createPaymentIntent);
stripeRoutes.post("/payment/addTokens/:id", StripeController.addTokensToUser);

export default stripeRoutes;
