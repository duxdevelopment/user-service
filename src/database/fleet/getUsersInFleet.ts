import { fleetSchema } from '../../schema/fleetSchema';
import { getClient, toItem } from '../../schema/base';
import { QueryInput } from 'aws-sdk/clients/dynamodb';

export const getUsersInFleet = async (
  id: string
): Promise<[typeof fleetSchema]> => {
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
