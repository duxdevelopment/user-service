import { DeepPartial } from 'dynamoose/dist/General';

export const ddbOptions: DeepPartial<unknown> = {
  create: false,
  waitForActive: true,
  waitForActiveTimeout: 180000,
  throughput: 'ON_DEMAND',
};
