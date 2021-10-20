import { PutItemInput } from 'aws-sdk/clients/dynamodb';
import { fleetSchema } from '../schema/fleetSchema';
import { userSchema } from '../schema/userSchema';
import { getClient } from '../schema/base';

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
  const client = getClient();
  const user = userSchema({
    id,
    stripeId,
    firstName,
    lastName,
    email,
    phoneNumber,
    isActive,
  });

  const params: PutItemInput = {
    TableName: `USERS${process.env.TABLE_PREFIX}`,
    Item: user,
  };

  const createUser = await client.putItem(params).promise();

  console.log('USER CREATED:', createUser);

  const userGroup = fleetSchema({ id, fleetType });

  const ugParams: PutItemInput = {
    TableName: `USERS${process.env.TABLE_PREFIX}`,
    Item: userGroup,
  };

  const createUserGroup = await client.putItem(ugParams).promise();

  console.log('USER GROUP CREATED:', createUserGroup);

  return createUser;
};
