import { runWarm } from '../utils';
import {
  corsErrorResponse,
  corsSuccessResponse,
  Response,
} from '../utils/lambda-response';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../database/schema';
import { Auth, Amplify } from 'aws-amplify';
import awsmobile from '../amplifyConfig';

Amplify.configure(awsmobile);
interface userInterface {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const registerUser = async (
  event: AWSLambda.APIGatewayEvent
): Promise<Response> => {
  console.log(event);

  if (event.body) {
    const { firstName, lastName, email, password }: userInterface = JSON.parse(
      event.body
    );

    try {
      const { userSub } = await Auth.signUp({
        username: email,
        password,
        attributes: {
          name: `${firstName} ${lastName}`,
          email,
        },
      });

      const userDoc = new User({
        userId: uuidv4(),
        firstName,
        lastName,
        email,
        cognitoId: userSub,
      });

      await userDoc.save();

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
