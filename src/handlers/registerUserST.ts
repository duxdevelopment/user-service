import { runWarm } from '../utils';
import {
  corsErrorResponse,
  corsSuccessResponse,
  Response,
} from '../utils/lambda-response';
import { v4 as uuidv4 } from 'uuid';
import { checkEmailST } from './getUserByEmailST';
import { DynamoDB } from 'aws-sdk';
import { userSchema } from '../database/dynamo';
import { createStripeUser } from './createStripeUser';
import { Auth, Amplify } from 'aws-amplify';
import awsmobile from '../amplifyConfig';

Amplify.configure(awsmobile);
interface userInterface {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

const client = new DynamoDB.DocumentClient();

const registerUser = async (
  event: AWSLambda.APIGatewayEvent
): Promise<Response> => {
  console.log(event);

  if (event.body) {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
    }: userInterface = JSON.parse(event.body);

    const exists = await checkEmailST(email);

    if (exists) {
      return corsErrorResponse({
        message: 'user already exists',
      });
    }

    try {
      const uid = uuidv4();

      const { id } = await createStripeUser({ firstName, lastName, email });

      const user = userSchema({
        id: uid,
        stripeId: id,
        firstName,
        lastName,
        email,
        phoneNumber,
      });

      client
        .batchWrite(user)
        .promise()
        .then((res) => console.log(res));

      const signUp = await Auth.signUp({
        username: email,
        password,
        attributes: {
          name: `${firstName} ${lastName}`,
          email,
          'custom:userId': uid,
        },
      });

      console.log(signUp);

      return corsSuccessResponse({
        message: 'User created',
      });
    } catch (error) {
      console.log('error signing up:', error);
    }
  }

  return corsErrorResponse({
    message: 'Error',
  });
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(registerUser);