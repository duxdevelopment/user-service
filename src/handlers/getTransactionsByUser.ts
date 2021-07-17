import { successResponse, runWarm, errorResponse } from '../utils';
import { Response } from '../utils/lambda-response';
import { Transaction } from '../database/schema';

const getTransactionsByUser = async (
  event: AWSLambda.APIGatewayEvent
): Promise<Response> => {
  console.log(event);
  // get user information from the token
  try {
    if (event.pathParameters) {
      const { userId } = event.pathParameters;
      console.log(userId);
      const result = await Transaction.query('userId').eq(userId).exec();
      const response = successResponse({
        transactions: result,
      });
      console.log(result);
      return response;
    }
  } catch (err) {
    console.log(err);
  }
  const response = errorResponse({
    message: 'There was an error',
  });

  return response;
};

export default runWarm(getTransactionsByUser);
