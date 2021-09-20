import { DynamoDB } from 'aws-sdk';
import { PutItemInput } from 'aws-sdk/clients/dynamodb';
import { userSchema } from '../schema/userSchema';
const client = new DynamoDB.DocumentClient();

interface userInterface {
  id: string;
  stripeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export const createUser = async ({
  id,
  stripeId,
  firstName,
  lastName,
  email,
  phoneNumber,
}: userInterface) => {
  const user = userSchema({
    id,
    stripeId,
    firstName,
    lastName,
    email,
    phoneNumber,
  });
  const params: PutItemInput = {
    TableName: `USERS${process.env.TABLE_PREFIX}`,
    Item: user,
  };

  const createUser = await client.put(params).promise();

  return createUser;
};
