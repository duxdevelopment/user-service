import { DeleteItemInput, DeleteItemOutput } from 'aws-sdk/clients/dynamodb';
import { getClient, toItem } from '../../schema/base';

export const deletePlate = async (
  userId: string,
  plateId: string
): Promise<DeleteItemOutput> => {
  const client = getClient();

  const params: DeleteItemInput = {
    TableName: `USERS${process.env.TABLE_PREFIX}`,
    Key: toItem({ PK: `USER:${userId}`, SK: `PLATE:${plateId}` }),
    ReturnValues: 'ALL_OLD',
  };

  return client.deleteItem(params).promise();
};
