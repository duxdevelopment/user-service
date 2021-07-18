import dynamoose, { Schema } from 'dynamoose';
import { ddbOptions } from './settings';

const userSchema = new Schema(
  {
    userId: {
      type: String,
      hashKey: true,
    },
    email: String,
    firstName: String,
    lastName: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    cognitoId: {
      type: String,
      index: {
        name: 'cognitoIndex',
        global: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const User = dynamoose.model('USERS', userSchema, ddbOptions);
