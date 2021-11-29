import { runWarm, corsSuccessResponse, Response } from '../../utils';
import { getPlateById } from '../../database/plate/getPlateById';
import { APIGatewayProxyEventHeaders } from 'aws-lambda';
import jwt_decode from 'jwt-decode';

const getPlates = async (
  event: AWSLambda.APIGatewayEvent
): Promise<Response> => {
  console.log(JSON.stringify(event));

  const headers: APIGatewayProxyEventHeaders = event.headers;
  const decode: any = jwt_decode(headers.Authorization!);
  const userId: string = decode['custom:userId'];
  const { plateId } = event.pathParameters!;

  console.log('USERID:', userId);

  // keep user ID and update to make sure they have permission to view this plate

  try {
    const plate = await getPlateById(plateId!);

    return corsSuccessResponse({ plate });
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
