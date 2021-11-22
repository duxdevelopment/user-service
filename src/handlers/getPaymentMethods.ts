import { corsSuccessResponse, corsErrorResponse, runWarm } from '../utils';
import { Response } from '../utils/lambda-response';
import { APIGatewayProxyEventHeaders } from 'aws-lambda';
import Stripe from 'stripe';
import jwt_decode from 'jwt-decode';
import { getUserById } from '../database/getUserById';
import { toJSON } from '../schema/base';

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

    const [user]: any = await getUserById(userId);

    const { stripeId } = toJSON(user);

    const paymentMethods = (
      await stripe.paymentMethods.list({
        customer: stripeId,
        type: 'card',
      })
    ).data.map((method) => {
      const { id } = method;
      const { brand, exp_month, exp_year, last4 } = method.card!;
      const card = {
        brand,
        expMonth: exp_month,
        expYear: exp_year,
        last4,
        id,
      };
      return card;
    });

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
