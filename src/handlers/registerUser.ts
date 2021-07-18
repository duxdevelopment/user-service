import { successResponse, runWarm, errorResponse } from '../utils';
import { Response } from '../utils/lambda-response';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../database/schema';
import { Auth, Amplify } from 'aws-amplify';
import awsmobile from '../amplifyConfig';

Amplify.configure(awsmobile);
interface userInterface {
  firstName: string;
  lastName: string;
  email: string;
  DOB: string;
  phoneNumber: string;
  password: string;
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
      DOB,
      phoneNumber,
      password,
    }: userInterface = JSON.parse(event.body);

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
        DOB,
        phoneNumber,
        cognitoId: userSub,
      });

      const saveUser = await userDoc.save();

      const response = successResponse({
        message: 'Transaction created',
        user: saveUser,
      });

      return response;
    } catch (error) {
      console.log('error signing up:', error);
    }
  }

  const response = errorResponse({
    message: 'An error occured',
  });

  return response;

  // get user information from the token
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(registerUser);
