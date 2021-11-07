import { QueryInput, QueryOutput } from 'aws-sdk/clients/dynamodb';
import { getClient, toItem } from '../../schema/base';

export const getPlateFromRecognition = async (
  registration: string
): Promise<QueryOutput> => {
  const client = getClient();

  const params: QueryInput = {
    TableName: `PLATES${process.env.TABLE_PREFIX}`,
    IndexName: 'GSI_1',
    KeyConditionExpression: '#registration = :registration',
    ExpressionAttributeValues: toItem({
      ':registration': registration,
    }),
    ExpressionAttributeNames: {
      '#registration': 'GSI_1_PK',
    },
  };

  return client.query(params).promise();
};
