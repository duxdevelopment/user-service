import { DynamoDB } from 'aws-sdk';
const client = new DynamoDB.DocumentClient();
export const getUserById = async (id: string): Promise<boolean> => {
  const params = {
    KeyConditionExpression: 'PK = :userId and begins_with(SK,:meta)',
    ExpressionAttributeValues: {
      ':userId': `USER:${id}`,
      ':meta': 'META',
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
      return false;
    })
    .catch((err) => {
      console.log(err);
      return true;
    });
};
