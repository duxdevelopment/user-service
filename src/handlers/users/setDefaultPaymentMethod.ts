import { corsSuccessResponse, corsErrorResponse, runWarm } from '../../utils';
import { Response } from '../../utils/lambda-response';
import { APIGatewayProxyEventHeaders } from 'aws-lambda';
import Stripe from 'stripe';
import jwt_decode from 'jwt-decode';
import { getUserById } from '../../database/user/getUserById';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-08-27',
});

const setDefaultPaymentMethod = async (
  event: AWSLambda.APIGatewayEvent
): Promise<Response> => {
  try {
    const headers: APIGatewayProxyEventHeaders = event.headers;
    const decode: any = jwt_decode(headers.Authorization!);
    const userId = decode['custom:userId'];
    const { paymentMethod } = event.pathParameters!;

    const [user]: any = await getUserById(userId);

    const { stripeId } = user;

    const customerUpdate = await stripe.customers.update(stripeId, {
      invoice_settings: {
        default_payment_method: paymentMethod,
      },
    });

    console.log(customerUpdate);

    return corsSuccessResponse({
      message: 'Successfully set default payment method',
    });
  } catch (err) {
    console.log(err);
  }
  const response = corsErrorResponse({
    message: 'Error adding payment method',
  });

  return response;
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(setDefaultPaymentMethod);
