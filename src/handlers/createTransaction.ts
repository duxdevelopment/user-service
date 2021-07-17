import { successResponse, runWarm } from '../utils';
import { Response } from '../utils/lambda-response';
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from '../database/schema';

//test

const createTransaction = async (
  event: AWSLambda.APIGatewayEvent
): Promise<Response> => {
  console.log(event);
  // get user information from the token
  const transactionDoc = new Transaction({
    transactionId: uuidv4(),
    price: 100,
    currency: 'AUD',
    userId: 'ABC123',
  });

  const tran = await transactionDoc.save();

  const response = successResponse({
    message: 'Transaction created',
    transaction: tran,
  });

  return response;
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(createTransaction);
