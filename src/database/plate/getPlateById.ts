import { QueryInput } from 'aws-sdk/clients/dynamodb';
import { getClient, toItem, mapOutput } from '../../schema/base';
import { plateSchemaInterface } from '../../schema/plateSchema';

export const getPlateById = async (
  registration: string
): Promise<plateSchemaInterface | null> => {
  const client = getClient();

  const params: QueryInput = {
    TableName: `USERS${process.env.TABLE_PREFIX}`,
    IndexName: 'invertedIndex',
    KeyConditionExpression: '#registration = :registration',
    ExpressionAttributeValues: toItem({
      ':registration': `PLATE:${registration}`,
    }),
    ExpressionAttributeNames: {
      '#registration': 'SK',
    },
  };

  const plate = await client.query(params).promise();

  console.log(plate);

  if (plate.Count! > 0) {
    console.log(plate);
    return mapOutput(plate.Items);
  } else {
    return null;
  }
};
