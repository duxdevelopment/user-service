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
      expand: ['data.plan.product'],
    });

    const mappedSubscriptions = subscriptions.data.map((subscription: any) => ({
      current_period_end: subscription.current_period_end,
      current_period_start: subscription.current_period_start,
      id: subscription.id,
      plan: {
        id: subscription.plan.id,
        active: subscription.plan.active,
        amount: subscription.plan.amount,
        currency: subscription.plan.currency,
        interval: subscription.plan.interval,
        interval_count: subscription.plan.interval_count,
        product: {
          id: subscription.plan.product.id,
          name: subscription.plan.product.name,
        },
      },
    }));

    return corsSuccessResponse({
      user: {
        ...user,
        subscriptions: mappedSubscriptions,
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
