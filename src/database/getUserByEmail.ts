import { DynamoDB } from 'aws-sdk';
const client = new DynamoDB.DocumentClient();
export const checkEmail = async (email: string): Promise<boolean> => {
  console.log(email);
  const params = {
    IndexName: 'GSI_1',
    KeyConditionExpression: 'GSI_1_PK = :email',
    ExpressionAttributeValues: {
      ':email': `EMAIL:${email}`,
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
