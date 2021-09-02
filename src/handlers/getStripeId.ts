import { User } from '../database/schema';
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-08-27',
});

export const getStripeId = async (userId: string): Promise<string> => {
  try {
    const user = await User.query('userId').eq(userId).exec();

    console.log(user);

    if (user.count > 0) {
      return user[0].stripeId;
    }
  } catch (error) {
    console.log('failed to get user: ', error);
  }

  return '';
};
