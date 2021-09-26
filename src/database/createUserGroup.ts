import { DynamoDB } from 'aws-sdk';
import { fleetSchema } from '../schema/fleetSchema';
const client = new DynamoDB.DocumentClient();

export const createUserGroup = async (id: string, fleetType: string) => {
  const fleet = fleetSchema({ id, fleetType });
  const params = {
    TableName: `USERS${process.env.TABLE_PREFIX}`,
    Item: fleet,
  };

  const createUserGroup = await client.put(params).promise();

  return createUserGroup;
};
