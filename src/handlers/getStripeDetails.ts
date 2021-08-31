import { corsSuccessResponse, corsErrorResponse, runWarm } from '../utils';
import { Response } from '../utils/lambda-response';
import { User } from '../database/schema';
import { APIGatewayProxyEventHeaders } from 'aws-lambda';
import Stripe from 'stripe';
import jwt_decode from 'jwt-decode';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-08-27',
});

const getStripeDetails = async (
  event: AWSLambda.APIGatewayEvent
): Promise<Response> => {
  try {
    const headers: APIGatewayProxyEventHeaders = event.headers;
    const decode: any = jwt_decode(headers.Authorization!);
    const userId = decode['custom:userId'];

    let [user]: any = await User.query('userId').eq(userId).exec();
    console.log(user);

    const paymentMethods = await stripe.paymentMethods.list({
      customer: user.stripeId,
      type: 'card',
    });
    console.log(paymentMethods);

    user = {
      ...user,
      paymentMethods,
    };

    return corsSuccessResponse({
      message: 'Fetched user details',
      user,
    });
  } catch (err) {
    console.log(err);
  }
  const response = corsErrorResponse({
    message: 'Error fetching user details',
  });

  return response;
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(getStripeDetails);
