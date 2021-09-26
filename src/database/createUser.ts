import { DynamoDB } from 'aws-sdk';
import { fleetSchema } from '../schema/fleetSchema';
import { userSchema } from '../schema/userSchema';
const client = new DynamoDB.DocumentClient();

interface userInterface {
  id: string;
  stripeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  fleetType?: string;
  isActive?: boolean;
}

export const createUser = async ({
  id,
  stripeId,
  firstName,
  lastName,
  email,
  phoneNumber,
  isActive = true,
  fleetType = 'standard',
}: userInterface) => {
  const user = userSchema({
    id,
    stripeId,
    firstName,
    lastName,
    email,
    phoneNumber,
    isActive,
  });

  const params = {
    TableName: `USERS${process.env.TABLE_PREFIX}`,
    Item: user,
  };

  const createUser = await client.put(params).promise();

  console.log('USER CREATED:', createUser);

  const userGroup = fleetSchema({ id, fleetType });

  const ugParams = {
    TableName: `USERS${process.env.TABLE_PREFIX}`,
    Item: userGroup,
  };

  const createUserGroup = await client.put(ugParams).promise();

  console.log('USER GROUP CREATED:', createUserGroup);

  return createUser;
};
