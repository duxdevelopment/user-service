import dynamoose, { Schema } from 'dynamoose';
import { ddbOptions } from './settings';

const transactionSchema = new Schema(
  {
    transactionId: {
      type: String,
      hashKey: true,
    },
    price: Number,
    currency: String,
    userId: {
      type: String,
      index: {
        name: 'userIndex',
        global: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Transaction = dynamoose.model(
  'TRANSACTIONS',
  transactionSchema,
  ddbOptions
);
