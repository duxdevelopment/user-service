import { DynamoDB } from 'aws-sdk';
import { fleetSchema } from '../../schema/fleetSchema';
const client = new DynamoDB.DocumentClient();

export const getUsersInFleet = async (
  id: string
): Promise<[typeof fleetSchema]> => {
  console.log(id);
  const params = {
    KeyConditionExpression: 'PK = :fleet AND begins_with(SK, :user)',
    ExpressionAttributeValues: {
      ':fleet': `FLEET:${id}`,
      ':user': 'USER',
    },
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
