import { DynamoDB } from 'aws-sdk';
const client = new DynamoDB.DocumentClient();

export const addUserToFleet = async (
  id: string,
  email: string,
  plateLimit: number,
  fleetId: string
) => {
  const fleet = `FLEET:${fleetId}`;
  const user = `USER:${id}`;
  const params = {
    TableName: `USERS${process.env.TABLE_PREFIX}`,
    Item: {
      PK: fleet,
      SK: user,
      email: email,
      plateLimit: plateLimit,
      userId: id,
    },
  };

  const addtoFleet = await client.put(params).promise();

  return addtoFleet;
};
