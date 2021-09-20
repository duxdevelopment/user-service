import { DynamoDB } from 'aws-sdk';
import { userGroupSchema } from '../schema/userGroupSchema';
const client = new DynamoDB.DocumentClient();

export const createUserGroup = async (id: string, userGroupType: string) => {
  const userGroup = userGroupSchema({ id, userGroupType });
  const params = {
    TableName: `USERS${process.env.TABLE_PREFIX}`,
    Item: userGroup,
  };

  const createUserGroup = await client.put(params).promise();

  return createUserGroup;
};
