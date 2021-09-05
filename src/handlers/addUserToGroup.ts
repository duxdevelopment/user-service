import { APIGatewayProxyEventHeaders } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { runWarm } from '../utils';
import jwt_decode from 'jwt-decode';
import {
  corsErrorResponse,
  corsSuccessResponse,
  Response,
} from '../utils/lambda-response';

import { getUserIdFromEmail } from './getUserIdFromEmail';

const client = new DynamoDB.DocumentClient();

const addUserToGroup = async (
  event: AWSLambda.APIGatewayEvent
): Promise<Response> => {
  console.log(event);

  const headers: APIGatewayProxyEventHeaders = event.headers;
  const decode: any = jwt_decode(headers.Authorization!);
  const userId = decode['custom:userId'];

  const { email }: any = JSON.parse(event.body!);

  if (!email) {
    return corsErrorResponse({
      message: 'no email found in request',
    });
  }

  const { id, firstName, lastName } = await getUserIdFromEmail(email);

  if (id) {
    const params = {
      TableName: 'USERS-TEST',
      Item: {
        PK: `UG#${userId}`,
        SK: id,
        isUserGroupOwner: false,
        firstName: firstName,
        lastName: lastName,
        GSI_1_PK: id,
      },
    };

    return client
      .put(params)
      .promise()
      .then((res) => {
        console.log(res);
        return corsSuccessResponse({
          message: 'User Added to Group',
        });
      })
      .catch((err) => {
        console.log(err);
        return corsErrorResponse({
          message: 'Error adding user to group',
        });
      });
  }

  return corsErrorResponse({ message: 'could not find user' });
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(addUserToGroup);
