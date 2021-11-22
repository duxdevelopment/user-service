import { corsSuccessResponse, corsErrorResponse, runWarm } from '../../utils';
import { Response } from '../../utils/lambda-response';
import { APIGatewayProxyEventHeaders } from 'aws-lambda';
import jwt_decode from 'jwt-decode';
import { checkEmail } from '../../database/user/getUserByEmail';
import { addUserToFleet } from '../../database/fleet/addUserToGroup';
import { toOutput } from '../../schema/base';

const addUserToFleetHandler = async (
  event: AWSLambda.APIGatewayEvent
): Promise<Response> => {
  try {
    const headers: APIGatewayProxyEventHeaders = event.headers;
    const decode: any = jwt_decode(headers.Authorization!);
    const userId = decode['custom:userId'];

    const { email }: any = JSON.parse(event.body!);

    const [requestedUser]: any = await checkEmail(email);
    console.log(requestedUser);

    if (!requestedUser) {
      return corsErrorResponse({
        message: 'Error adding user to fleet',
      });
    }

    const addUser = await addUserToFleet(
      toOutput(requestedUser.id),
      email,
      userId
    );

    console.log(addUser);

    return corsSuccessResponse({
      message: 'User added to group',
    });
  } catch (err) {
    console.log(err);
  }
  const response = corsErrorResponse({
    message: 'Error adding user to fleet',
  });

  return response;
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(addUserToFleetHandler);
