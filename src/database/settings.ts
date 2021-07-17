import { DeepPartial } from 'dynamoose/dist/General';

export const ddbOptions: DeepPartial<unknown> = {
  create: true,
  waitForActive: true,
  waitForActiveTimeout: 180000,
  throughput: 'ON_DEMAND',
};
