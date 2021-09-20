import { DynamoDB } from 'aws-sdk';
import { PutItemInput } from 'aws-sdk/clients/dynamodb';
import { userGroupSchema } from '../schema/userGroupSchema';
const client = new DynamoDB.DocumentClient();

export const createUserGroup = async (id: string, userGroupType: string) => {
  const userGroup = userGroupSchema({ id, userGroupType });
  const params: PutItemInput = {
    TableName: `USERS${process.env.TABLE_PREFIX}`,
    Item: userGroup,
  };

  const createUserGroup = await client.put(params).promise();

  return createUserGroup;
};
