import { DynamoDB } from 'aws-sdk';
const client = new DynamoDB.DocumentClient();
export const getUserIdFromEmail = async (email: string): Promise<any> => {
  const params = {
    IndexName: 'GSI_1',
    KeyConditionExpression: 'GSI_1_PK = :email',
    ExpressionAttributeValues: {
      ':email': `EMAIL#${email}`,
    },
    TableName: 'USERS-TEST',
  };

  return client
    .query(params)
    .promise()
    .then((res: any) => {
      console.log(res);
      if (res.Count > 0) {
        return {
          id: res.Items[0].PK,
          firstName: res.Items[0].firstName,
          lastName: res.Items[0].lastName,
        };
      }
      return null;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};
