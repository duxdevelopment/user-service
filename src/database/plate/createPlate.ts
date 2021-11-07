import { PutItemInput, PutItemOutput } from 'aws-sdk/clients/dynamodb';
import { plateSchema, plateSchemaInterface } from '../../schema/plateSchema';
import { getClient } from '../../schema/base';

export const createPlate = async ({
  userId,
  registration,
  state,
  vehicleType,
}: plateSchemaInterface): Promise<PutItemOutput> => {
  const client = getClient();
  const plate = plateSchema({
    userId,
    registration,
    state,
    vehicleType,
    isActive: true,
  });

  const params: PutItemInput = {
    TableName: `USERS${process.env.TABLE_PREFIX}`,
    Item: plate,
  };

  return client.putItem(params).promise();
};
