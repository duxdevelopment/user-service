import { DynamoDB } from 'aws-sdk';

const {
  Converter: { unmarshall, marshall, output },
} = DynamoDB;

let client: any = null;

export const getClient = (): DynamoDB => {
  if (client) return client;
  client = new DynamoDB({
    httpOptions: {
      connectTimeout: 1000,
      timeout: 1000,
    },
  });
  return client;
};

export const createKey = (pk: string, sk: string) => {
  return {
    PK: pk,
    SK: sk,
    createdAt: Date.now(),
  };
};

export const mapOutput = (item: any) => {
  return item.map((i: any) => unmarshall(i));
};

export const toOutput = (data: any) => {
  return output(data);
};
export const toItem = (data: any) => {
  return marshall(data);
};

export const toJSON = (data: any) => {
  return unmarshall(data);
};

/**
 * Update item in DynamoDB table
 * @param {string} tableName // Name of the target table
 * @param {object} key // Object containing target item key(s)
 * @param {object} item // Object containing updates for target item
 */

export const updateItem = async (
  tableName: string,
  PK: string,
  SK: string,
  item: any
) => {
  const client = getClient();
  const itemKeys = Object.keys(item);

  const { Attributes } = await client
    .updateItem({
      TableName: tableName,
      Key: toItem({ PK, SK }),
      ReturnValues: 'ALL_NEW',
      UpdateExpression: `SET ${itemKeys
        .map((k, index) => {
          console.log('UPDATE FIELD:', k);
          return `#field${index} = :value${index}`;
        })
        .join(', ')}`,
      ExpressionAttributeNames: itemKeys.reduce(
        (accumulator, k, index) => ({ ...accumulator, [`#field${index}`]: k }),
        {}
      ),
      ExpressionAttributeValues: toItem(
        itemKeys.reduce(
          (accumulator, k, index) => ({
            ...accumulator,
            [`:value${index}`]: item[k],
          }),
          {}
        )
      ),
    })
    .promise();

  return unmarshall(Attributes!);
};
