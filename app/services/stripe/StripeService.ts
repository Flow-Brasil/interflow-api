import { sequelize } from "@database/sequelize";
import { User } from "@models/users/User";
import { Stripe } from "stripe";
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY, {
  apiVersion: "2022-11-15",
  typescript: true
});

const userRepository = sequelize.getRepository(User);

class StripeService {
    async createPaymentIntent(userId: string, amount: number, currency: string) {
        const user = await userRepository.findByPk(userId);
        try {
        
        let costumers = await stripe.customers.list()
        let costumer = costumers.data.find((costumer) => costumer.email === user.dataValues.email)

        console.log("COSTUMERS", costumer)
        
        if (!costumer) {
            costumer = await stripe.customers.create({
                name: user.dataValues.nickname,
                email: user.dataValues.email,
                address: {
                },
            });
        }

        const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: costumer.id },
            { apiVersion: "2022-11-15" }
        );

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            customer: costumer.id,
            payment_method_types: ["card"],
        });

      return {
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: costumer.id
      };
    } catch (err: any) {
      console.log("ERROR ---", err);
      return err;
    }
  }

  async addTokensToUser(userId: string, amount: number) {
    const user = await userRepository.findByPk(userId);

    try{
        await user.update({
            interflowTokens: user.interflowTokens + amount
        })
        
        return user;
    } catch (err: any) {
        console.log("ERROR ---", err);
        return err;
    }    

  }
}

export default new StripeService();
