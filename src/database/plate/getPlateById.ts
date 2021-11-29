import { QueryInput } from 'aws-sdk/clients/dynamodb';
import { getClient, toItem, mapOutput } from '../../schema/base';
import { plateSchemaInterface } from '../../schema/plateSchema';

export const getPlateById = async (
  registration: string
): Promise<plateSchemaInterface | null> => {
  const client = getClient();

  const params: QueryInput = {
    TableName: `USERS${process.env.TABLE_PREFIX}`,
    IndexName: 'GSI_1',
    KeyConditionExpression: '#registration = :registration',
    ExpressionAttributeValues: toItem({
      ':registration': `REGO:${registration}`,
    }),
    ExpressionAttributeNames: {
      '#registration': 'GSI_1_PK',
    },
  };

  const plate = await client.query(params).promise();

  if (plate.Count === 0) {
    return mapOutput(plate);
  } else {
    return null;
  }
};
