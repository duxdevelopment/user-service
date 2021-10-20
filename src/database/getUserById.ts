import { QueryInput, QueryOutput } from 'aws-sdk/clients/dynamodb';
import { getClient, toItem } from '../schema/base';

export const getUserById = async (id: string): Promise<QueryOutput> => {
  const client = getClient();
  const params: QueryInput = {
    KeyConditionExpression: 'PK = :userId and begins_with(SK,:meta)',
    ExpressionAttributeValues: toItem({
      ':userId': `USER:${id}`,
      ':meta': 'META',
    }),
    TableName: `USERS${process.env.TABLE_PREFIX}`,
  };

  return client
    .query(params)
    .promise()
    .then((res: any) => {
      if (res.Count > 0) {
        return res.Items;
      }
      return false;
    })
    .catch((err) => {
      console.log(err);
      return true;
    });
};
