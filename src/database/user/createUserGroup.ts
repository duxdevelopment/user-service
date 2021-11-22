import { PutItemInput } from 'aws-sdk/clients/dynamodb';
import { getClient } from '../../schema/base';
import { fleetSchema } from '../../schema/fleetSchema';

export const createUserGroup = async (id: string, fleetType: string) => {
  const client = getClient();
  const fleet = fleetSchema({ id, fleetType });
  const params: PutItemInput = {
    TableName: `USERS${process.env.TABLE_PREFIX}`,
    Item: fleet,
  };

  const createUserGroup = await client.putItem(params).promise();

  return createUserGroup;
};
