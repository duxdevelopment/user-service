import { runWarm, corsSuccessResponse, Response } from '../../utils';
import { getUsersPlates } from '../../database/plate/getUsersPlates';
import { APIGatewayProxyEventHeaders } from 'aws-lambda';
import jwt_decode from 'jwt-decode';

const getPlates = async (
  event: AWSLambda.APIGatewayEvent
): Promise<Response> => {
  console.log(JSON.stringify(event));

  const headers: APIGatewayProxyEventHeaders = event.headers;
  const decode: any = jwt_decode(headers.Authorization!);
  const userId: string = decode['custom:userId'];

  try {
    const plates = await getUsersPlates(userId);

    return corsSuccessResponse({ plates });
  } catch (error) {
    console.log(error);
    return corsSuccessResponse({
      error: 'Error getting plates',
    });
  }
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(getPlates);
