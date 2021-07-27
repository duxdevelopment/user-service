import dynamoose, { Schema } from 'dynamoose';
import { ddbOptions } from './settings';

const userSchema = new Schema(
  {
    userId: {
      type: String,
      hashKey: true,
    },
    email: {
      type: String,
      index: {
        name: 'emailIndex',
        global: true,
      },
    },
    stripeId: {
      type: String,
      index: {
        name: 'stripeIndex',
        global: true,
      },
    },
    firstName: String,
    lastName: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const User = dynamoose.model('USERS', userSchema, ddbOptions);
