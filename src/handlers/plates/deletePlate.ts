import { corsSuccessResponse, corsErrorResponse, runWarm } from '../../utils';
import { Response } from '../../utils/lambda-response';
import { APIGatewayProxyEventHeaders } from 'aws-lambda';
import jwt_decode from 'jwt-decode';
import { deletePlate } from '../../database/plate/deletePlate';

const createPlateHandler = async (
  event: AWSLambda.APIGatewayEvent
): Promise<Response> => {
  try {
    const headers: APIGatewayProxyEventHeaders = event.headers;
    const decode: any = jwt_decode(headers.Authorization!);
    const userId: string = decode['custom:userId'];
    const { plateId } = JSON.parse(event.body!);

    const plateDoc = await deletePlate(userId, plateId);

    console.log('PLATE DELETE', plateDoc);

    return corsSuccessResponse({
      message: 'plate deleted',
    });
  } catch (err) {
    console.log(err);
    return corsErrorResponse({
      message: 'Error deleting plate',
    });
  }
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(createPlateHandler);
