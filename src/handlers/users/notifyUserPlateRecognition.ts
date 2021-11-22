import { runWarm } from '../../utils';
// import { getUserById } from '../../database/user/getUserById';
// import { SNS } from 'aws-sdk';

// const sns = new SNS({
//   region: 'ap-southeast-2',
// });

const notifyUserPlateRecognition = async (
  event: AWSLambda.SNSEvent
): Promise<void> => {
  console.log(JSON.stringify(event));

  const { plate, user, purchase } = JSON.parse(event.Records[0].Sns.Message);

  console.log(plate, user, purchase);

  //get user number from table

  // create transaction
};

export default runWarm(notifyUserPlateRecognition);
