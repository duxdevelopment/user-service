import { QueryInput, QueryOutput } from 'aws-sdk/clients/dynamodb';
import { getClient, toItem } from '../../schema/base';

export const getUsersPlates = async (userId: string): Promise<QueryOutput> => {
  const client = getClient();

  const params: QueryInput = {
    TableName: `USERS${process.env.TABLE_PREFIX}`,
    KeyConditionExpression: 'PK = :user AND begins_with(SK,:plate)',
    ExpressionAttributeValues: toItem({
      ':user': `USER:${userId}`,
      ':plate': 'PLATE:',
    }),
  };

  return client.query(params).promise();
};
