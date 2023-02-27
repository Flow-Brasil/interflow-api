import StripeService from "app/services/stripe/StripeService";
import { Request, Response } from "express";

class StripeController {
    public async createPaymentIntent(req: Request, res: Response): Promise<Response> {
        try {
            const amount = req.body.amount;
            const currency = req.body.currency;
            const userId = req.params.id
            const paymentIntent = await StripeService.createPaymentIntent(userId, amount, currency);
            return res.status(200).json(paymentIntent);
        } catch (err: any) {
            console.log('ERROR ---', err)
            return res.status(400).json({ message: "Invalid ID" });
        }
    }

    public async addTokensToUser(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.params.id;
            const tokensAmount = req.body.tokensAmount;
            const user = await StripeService.addTokensToUser(userId, tokensAmount);
            return res.status(200).json({user: user});
        } catch (err: any) {
            console.log('ERROR ---', err)
            return res.status(400).json({ message: "Invalid ID" });
        }
    }
}

export default new StripeController();