import { DynamoDB } from 'aws-sdk';
const client = new DynamoDB.DocumentClient();

export const addUserToGroup = async (id: string, userGroupId: string) => {
  const userGroup = `UG:${userGroupId}`;
  const user = `USER:${id}`;
  const params = {
    TableName: `USERS${process.env.TABLE_PREFIX}`,
    Item: {
      PK: userGroup,
      SK: user,
      userId: id,
    },
  };

  const addUserToGroup = await client.put(params).promise();

  return addUserToGroup;
};
