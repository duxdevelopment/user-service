import { getUserById } from '../../database/user/getUserById';
import {
  corsErrorResponse,
  corsSuccessResponse,
  runWarm,
  Response,
} from '../../utils';
import jwt_decode from 'jwt-decode';
import { APIGatewayProxyEventHeaders } from 'aws-lambda';
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2020-08-27',
});

const getUserInfo = async (
  event: AWSLambda.APIGatewayEvent
): Promise<Response> => {
  console.log(JSON.stringify(event));

  const headers: APIGatewayProxyEventHeaders = event.headers;
  const decode: any = jwt_decode(headers.Authorization!);
  const userId = decode['custom:userId'];

  try {
    const [user]: any = await getUserById(userId);

    const { stripeId } = user;

    const subscriptions = await stripe.subscriptions.list({
      customer: stripeId,
    });

    return corsSuccessResponse({
      user: {
        ...user,
        subscriptions: subscriptions.data,
      },
    });
  } catch (err) {
    console.log(err);

    return corsErrorResponse({
      message: 'Error getting user',
    });
  }
};

export default runWarm(getUserInfo);
