// import Stripe from 'stripe';
// import { getUserById } from '../database/getUserById';

// export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2020-08-27',
// });

// export const getStripeId = async (userId: string): Promise<string> => {
//   try {
//     const user = await getUserById(userId);

//     console.log(user);

//     if (user.Count! > 0) {
//       return user.Items[0].stripeId!;
//     }
//   } catch (error) {
//     console.log('failed to get user: ', error);
//   }

//   return '';
// };
