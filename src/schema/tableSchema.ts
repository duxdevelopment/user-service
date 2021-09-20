import AWS from 'aws-sdk';
AWS.config.update({
  region: 'ap-southeast-2',
});

const dynamodb = new AWS.DynamoDB();

const params = {
  TableName: `USERS${process.env.TABLE_PREFIX}`,
  KeySchema: [
    { AttributeName: 'PK', KeyType: 'HASH' },
    { AttributeName: 'SK', KeyType: 'RANGE' },
  ],
  AttributeDefinitions: [
    { AttributeName: 'PK', AttributeType: 'S' },
    { AttributeName: 'SK', AttributeType: 'S' },
    { AttributeName: 'GSI_1_PK', AttributeType: 'S' },
    { AttributeName: 'GSI_2_PK', AttributeType: 'S' },
    { AttributeName: 'GSI_1_SK', AttributeType: 'S' },
    { AttributeName: 'GSI_2_SK', AttributeType: 'S' },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'GSI_1',
      KeySchema: [
        {
          AttributeName: 'GSI_1_PK',
          KeyType: 'HASH',
        },
        {
          AttributeName: 'GSI_1_SK',
          KeyType: 'RANGE',
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },

      Projection: {
        ProjectionType: 'ALL',
      },
    },
    {
      IndexName: 'GSI_2',
      KeySchema: [
        {
          AttributeName: 'GSI_2_PK',
          KeyType: 'HASH',
        },
        {
          AttributeName: 'GSI_2_SK',
          KeyType: 'RANGE',
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
      Projection: {
        ProjectionType: 'ALL',
      },
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10,
  },
};

export const handler = async () => {
  console.log('LOGGED');

  const createTable = await dynamodb.createTable(params).promise();

  console.log(createTable);
};
