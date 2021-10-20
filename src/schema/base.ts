import { DynamoDB } from 'aws-sdk';

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

export const toItem = (data: any) => {
  return DynamoDB.Converter.marshall(data);
};
