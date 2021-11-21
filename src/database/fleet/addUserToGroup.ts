import { PutItemInput } from 'aws-sdk/clients/dynamodb';
import { getClient } from '../../schema/base';
import { fleetUserSchema } from '../../schema/fleetSchema';

export const addUserToFleet = async (
  id: string,
  email: string,
  fleet: string
) => {
  const client = getClient();
  const params: PutItemInput = {
    TableName: `USERS${process.env.TABLE_PREFIX}`,
    Item: fleetUserSchema({ fleetId: fleet, userId: id, email }),
  };

  const addtoFleet = await client.putItem(params).promise();

  return addtoFleet;
};
