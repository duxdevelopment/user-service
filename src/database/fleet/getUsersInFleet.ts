import { getClient, mapOutput, toItem } from '../../schema/base';
import { QueryInput, QueryOutput } from 'aws-sdk/clients/dynamodb';

export const getUsersInFleet = async (id: string): Promise<QueryOutput> => {
  console.log(id);
  const client = getClient();

  const params: QueryInput = {
    KeyConditionExpression: 'PK = :fleet AND begins_with(SK, :user)',
    ExpressionAttributeValues: toItem({
      ':fleet': `FLEET:${id}`,
      ':user': 'USER',
    }),
    TableName: `USERS${process.env.TABLE_PREFIX}`,
  };

  return client
    .query(params)
    .promise()
    .then((res: any) => {
      console.log(res);
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
