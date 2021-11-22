import { QueryInput } from 'aws-sdk/clients/dynamodb';
import { mapOutput } from '../../schema/base';
import { userSchemaInterface } from '../../schema/userSchema';
import { getClient, toItem } from '../../schema/base';

export const getUserById = async (
  id: string
): Promise<Array<userSchemaInterface>> => {
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
        return mapOutput(res.Items);
      }
      return [];
    })
    .catch((err) => {
      console.log(err);
      return [];
    });
};
