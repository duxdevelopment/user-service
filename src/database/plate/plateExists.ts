import { QueryInput } from 'aws-sdk/clients/dynamodb';
import { getClient, toItem } from '../../schema/base';

export const plateExists = async (registration: string): Promise<boolean> => {
  const client = getClient();

  const params: QueryInput = {
    TableName: `USERS${process.env.TABLE_PREFIX}`,
    IndexName: 'GSI_1',
    KeyConditionExpression: '#registration = :registration',
    ExpressionAttributeValues: toItem({
      ':registration': `REGO:${registration}`,
    }),
    ExpressionAttributeNames: {
      '#registration': 'GSI_1_PK',
    },
  };

  const checkPlate = await client.query(params).promise();

  if (checkPlate.Count === 0) {
    return false;
  } else {
    return true;
  }
};
