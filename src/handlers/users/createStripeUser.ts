import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-08-27',
});

const freePlan = 'price_1JywJ0G1ixT53HofH7ckAfNe';

interface stripeUser {
  firstName: string;
  lastName: string;
  email: string;
}

export const createStripeUser = async ({
  firstName,
  lastName,
  email,
}: stripeUser) => {
  const user = await stripe.customers.create({
    name: `${firstName} ${lastName}`,
    email,
    description: 'Customer created from API',
  });

  const userSub = await stripe.subscriptions.create({
    customer: user.id,
    items: [
      {
        price: freePlan,
      },
    ],
  });

  console.log(userSub);
  return { id: user.id };
};
