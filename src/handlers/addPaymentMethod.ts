import { corsSuccessResponse, corsErrorResponse, runWarm } from '../utils';
import { Response } from '../utils/lambda-response';
import { APIGatewayProxyEventHeaders } from 'aws-lambda';
import Stripe from 'stripe';
import jwt_decode from 'jwt-decode';
import { getUserById } from '../database/getUserById';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-08-27',
});

const addPaymentMethod = async (
  event: AWSLambda.APIGatewayEvent
): Promise<Response> => {
  try {
    const headers: APIGatewayProxyEventHeaders = event.headers;
    const decode: any = jwt_decode(headers.Authorization!);
    const userId = decode['custom:userId'];
    const { cardNumber, expMonth, expYear, cvc, cardHolder } = JSON.parse(
      event.body!
    );

    const [user]: any = await getUserById(userId);

    const { stripeId } = user;

    const card = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: cardNumber,
        exp_month: expMonth,
        exp_year: expYear,
        cvc: cvc,
      },
      billing_details: {
        name: cardHolder,
      },
    });

    const paymentMethod = await stripe.paymentMethods.attach(card.id, {
      customer: stripeId,
    });

    return corsSuccessResponse({
      message: 'Successfully added payment method',
      paymentMethod,
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
export default runWarm(addPaymentMethod);
