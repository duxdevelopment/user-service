import { QueryInput } from 'aws-sdk/clients/dynamodb';
import { plateSchemaInterface } from '../../schema/plateSchema';
import { getClient, mapOutput, toItem } from '../../schema/base';

export const getPlateFromRecognition = async (
  registration: string
): Promise<Array<plateSchemaInterface>> => {
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

  return client
    .query(params)
    .promise()
    .then((res) => {
      if (res.Count! > 0) {
        return mapOutput(res.Items);
      }
      return [];
    })
    .catch((err) => {
      console.log(err);
      return [];
    });
};
