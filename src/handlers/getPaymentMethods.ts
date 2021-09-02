import { corsSuccessResponse, corsErrorResponse, runWarm } from '../utils';
import { Response } from '../utils/lambda-response';
import { APIGatewayProxyEventHeaders } from 'aws-lambda';
import { getStripeId } from './getStripeId';
import Stripe from 'stripe';
import jwt_decode from 'jwt-decode';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-08-27',
});

const getPaymentDetails = async (
  event: AWSLambda.APIGatewayEvent
): Promise<Response> => {
  try {
    const headers: APIGatewayProxyEventHeaders = event.headers;
    const decode: any = jwt_decode(headers.Authorization!);
    const userId = decode['custom:userId'];

    const stripeId: any = await getStripeId(userId);

    const paymentMethods = await stripe.paymentMethods.list({
      customer: stripeId,
      type: 'card',
    });
    console.log(paymentMethods);

    return corsSuccessResponse({
      message: 'Fetched payment methods',
      paymentMethods,
    });
  } catch (err) {
    console.log(err);
  }
  const response = corsErrorResponse({
    message: 'Error fetching payment methods',
  });

  return response;
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(getPaymentDetails);
