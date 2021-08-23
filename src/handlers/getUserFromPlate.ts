import { User } from '../database/schema';
import { runWarm } from '../utils';
import { SNS } from 'aws-sdk';

const sns = new SNS({
  region: 'ap-southeast-2',
});

const getUserFromPlate = async (event: AWSLambda.SNSEvent): Promise<void> => {
  console.log(JSON.stringify(event));

  const { plate, cost } = JSON.parse(event.Records[0].Sns.Message);

  const user = await User.query('userId').eq(plate.userId).exec();
  console.log(user);

  if (user.count != 0) {
    const price = (Math.round(cost) / 100).toFixed(2);
    const msg = { user: user[0], cost, price };

    const params = {
      Message: JSON.stringify(msg),
      TopicArn: process.env.USER_SERVICE_TOPIC_ARN,
    };

    await sns.publish(params).promise();
    console.log('Published to user service topic');

    // const notification = {
    //   Message: `TEXT_MESSAGE: Payment of $${price} made by ${plate.registration}`,
    //   PhoneNumber: user[0].phoneNumber,
    // };

    // await sns.publish(notification).promise();
    // console.log('Notification sent to user');
  }
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(getUserFromPlate);
