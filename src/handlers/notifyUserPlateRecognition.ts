import { User } from '../database/schema';
import { runWarm } from '../utils';
// import { SNS } from 'aws-sdk';

// const sns = new SNS({
//   region: 'ap-southeast-2',
// });

const notifyUserPlateRecognition = async (
  event: AWSLambda.SNSEvent
): Promise<void> => {
  console.log(JSON.stringify(event));

  const { Document } = JSON.parse(event.Records[0].Sns.Message);

  await User.query('userId').eq(Document.userId).exec();

  //get user number from table
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(notifyUserPlateRecognition);
