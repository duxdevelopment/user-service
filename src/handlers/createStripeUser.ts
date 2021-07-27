import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY!, {
  apiVersion: '2020-08-27',
});

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
  return { id: user.id };
};
