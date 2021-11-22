import { getClient, toItem } from '../../schema/base';
import { QueryInput, QueryOutput } from 'aws-sdk/clients/dynamodb';

export const checkEmail = async (email: string): Promise<QueryOutput> => {
  const client = getClient();
  console.log(email);
  const params: QueryInput = {
    IndexName: 'GSI_1',
    KeyConditionExpression: 'GSI_1_PK = :email',
    ExpressionAttributeValues: toItem({
      ':email': `EMAIL:${email}`,
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
      return null;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};
