import { corsSuccessResponse, corsErrorResponse, runWarm } from '../../utils';
import { Response } from '../../utils/lambda-response';
import { APIGatewayProxyEventHeaders } from 'aws-lambda';
import jwt_decode from 'jwt-decode';
import { getUsersInFleet } from '../../database/fleet/getUsersInFleet';

const getUsersInFleetHandler = async (
  event: AWSLambda.APIGatewayEvent
): Promise<Response> => {
  try {
    const headers: APIGatewayProxyEventHeaders = event.headers;
    const decode: any = jwt_decode(headers.Authorization!);
    const userId = decode['custom:userId'];

    const fleetUsers = await getUsersInFleet(userId);

    return corsSuccessResponse({
      fleetUsers,
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
export default runWarm(getUsersInFleetHandler);
