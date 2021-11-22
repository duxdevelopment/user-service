import { QueryInput } from 'aws-sdk/clients/dynamodb';
import { getClient, toItem } from '../../schema/base';

export const getUserGroupsForUser = async (userId: string) => {
  const client = getClient();
  const params: QueryInput = {
    IndexName: 'invertedIndex',
    KeyConditionExpression: 'SK = :user and begins_with(PK,:ug)',
    ExpressionAttributeValues: toItem({
      ':user': `USER:${userId}`,
      ':ug': 'UG',
    }),
    TableName: `USERS${process.env.TABLE_PREFIX}`,
  };

  const getGroupsForUser = await client.query(params).promise();
  console.log(getGroupsForUser);
}; // runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
