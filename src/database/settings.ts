import { DeepPartial } from 'dynamoose/dist/General';

export const ddbOptions: DeepPartial<unknown> = {
  create: true,
  waitForActive: true,
  prefix: process.env.TABLE_PREFIX,
  waitForActiveTimeout: 180000,
  throughput: 'ON_DEMAND',
};
