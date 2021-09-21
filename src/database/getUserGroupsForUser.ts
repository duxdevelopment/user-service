import { DynamoDB } from 'aws-sdk';

const client = new DynamoDB.DocumentClient();

export const getUserGroupsForUser = async (userId: string) => {
  const params = {
    IndexName: 'invertedIndex',
    KeyConditionExpression: 'SK = :user and begins_with(PK,:ug)',
    ExpressionAttributeValues: {
      ':user': `USER:${userId}`,
      ':ug': 'UG',
    },
    TableName: `USERS${process.env.TABLE_PREFIX}`,
  };

  const getGroupsForUser = await client.query(params).promise();
  console.log(getGroupsForUser);
}; // runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
