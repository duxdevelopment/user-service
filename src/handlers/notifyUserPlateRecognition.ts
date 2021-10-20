import { runWarm } from '../utils';
import { getUserById } from '../database/getUserById';
// import { SNS } from 'aws-sdk';

// const sns = new SNS({
//   region: 'ap-southeast-2',
// });

const notifyUserPlateRecognition = async (
  event: AWSLambda.SNSEvent
): Promise<void> => {
  console.log(JSON.stringify(event));

  const { Document } = JSON.parse(event.Records[0].Sns.Message);

  const { userId } = Document;

  await getUserById(userId);

  //get user number from table
};

export default runWarm(notifyUserPlateRecognition);
