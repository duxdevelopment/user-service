import { runWarm } from '../../utils';
import {
  corsErrorResponse,
  corsSuccessResponse,
  Response,
} from '../../utils/lambda-response';
import { v4 as uuidv4 } from 'uuid';
import { createUser } from '../../database/user/createUser';
import { createStripeUser } from './createStripeUser';
import { Auth, Amplify } from 'aws-amplify';
import awsmobile from '../../amplifyConfig';
import { checkEmail } from '../../database/user/getUserByEmail';

Amplify.configure(awsmobile);

interface userInterface {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

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

    try {
      const uid = uuidv4();

      const emailInUse = await checkEmail(email);

      console.log(emailInUse);

      if (emailInUse) {
        return corsErrorResponse({
          message: 'email in use',
        });
      }

      const { id } = await createStripeUser({ firstName, lastName, email });

      console.log(id);

      const user = await createUser({
        id: `${uid}`,
        stripeId: id,
        firstName,
        lastName,
        phoneNumber,
        email,
      });

      console.log(user);

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
