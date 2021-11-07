import { corsSuccessResponse, corsErrorResponse, runWarm } from '../../utils';
import { Response } from '../../utils/lambda-response';
import { createPlate } from '../../database/plate/createPlate';
import { APIGatewayProxyEventHeaders } from 'aws-lambda';
import jwt_decode from 'jwt-decode';

const createPlateHandler = async (
  event: AWSLambda.APIGatewayEvent
): Promise<Response> => {
  try {
    const headers: APIGatewayProxyEventHeaders = event.headers;
    const decode: any = jwt_decode(headers.Authorization!);
    const userId: string = decode['custom:userId'];
    const { registration, state, vehicleType } = JSON.parse(event.body!);

    const plateDoc = await createPlate({
      userId,
      registration,
      state,
      vehicleType,
    });

    console.log(plateDoc);

    return corsSuccessResponse({
      message: 'Plate created',
    });
  } catch (err) {
    console.log(err);
    return corsErrorResponse({
      message: 'Error creating plate',
    });
  }
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(createPlateHandler);
