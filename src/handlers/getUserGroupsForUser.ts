import { DynamoDB } from 'aws-sdk';
import { runWarm } from '../utils';
import {
  corsErrorResponse,
  corsSuccessResponse,
  Response,
} from '../utils/lambda-response';

const client = new DynamoDB.DocumentClient();

const addUserToGroup = async (
  event: AWSLambda.APIGatewayEvent
): Promise<Response> => {
  console.log(event);

  const params = {
    IndexName: 'invertedIndex',
    KeyConditionExpression: 'PK = :user',
    ExpressionAttributeValues: {
      ':user': `USER#05f4b3cb-8eed-4623-83ff-e01faf5118ac`,
    },
    TableName: 'USERS-TEST',
  };

  return client
    .query(params)
    .promise()
    .then((res: any) => {
      if (res.Count > 0) {
        return corsSuccessResponse({ message: res });
      }
      return corsErrorResponse({ message: res });
    })
    .catch((err) => {
      console.log(err);
      return corsErrorResponse({ message: err });
    });
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(addUserToGroup);
