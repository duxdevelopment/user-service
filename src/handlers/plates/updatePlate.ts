import { corsSuccessResponse, corsErrorResponse, runWarm } from '../../utils';
import { Response } from '../../utils/lambda-response';
import { APIGatewayProxyEventHeaders } from 'aws-lambda';
import jwt_decode from 'jwt-decode';
import { updateItem } from '../../schema/base';

const updatePlateHandler = async (
  event: AWSLambda.APIGatewayEvent
): Promise<Response> => {
  try {
    const headers: APIGatewayProxyEventHeaders = event.headers;
    const decode: any = jwt_decode(headers.Authorization!);
    const userId: string = decode['custom:userId'];
    const { plateId, updateContent } = JSON.parse(event.body!);

    console.log(event.body);

    const update = await updateItem(
      `USERS${process.env.TABLE_PREFIX}`,
      `USER:${userId}`,
      `PLATE:${plateId}`,
      updateContent
    );

    console.log(update);

    return corsSuccessResponse({
      message: 'plate updated',
    });
  } catch (err) {
    console.log(err);
    return corsErrorResponse({
      message: 'Error updating plate',
    });
  }
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(updatePlateHandler);
